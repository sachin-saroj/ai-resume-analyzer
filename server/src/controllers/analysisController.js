const Analysis = require('../models/Analysis');
const { extractResumeText } = require('../services/parsing/resumeExtractor');
const { extractStructuredResume, extractStructuredJD } = require('../services/parsing/localExtractor');
const { categorizeSkill } = require('../services/ontology/skillOntology');
const { generateCareerPaths } = require('../services/ontology/careerInsights');
const { calculateSemanticMatrix } = require('../services/analysis/semanticMatching');
const { simulateATS } = require('../services/analysis/atsSimulation');
const { generateDynamicScore } = require('../services/analysis/scoringEngine');
const { generateInsights } = require('../services/analysis/insightsEngine');
const { predictSalary } = require('../services/analysis/salaryEngine');
const { analyzeActionVerbs } = require('../services/analysis/actionVerbDetector');
const { computeVersionDiff } = require('../services/analysis/versionIntelligence');
const { generateExcelReport } = require('../services/analysis/excelExport');
const { calculatePercentile } = require('../metrics/benchmarkEngine');
const mockLinkedIn = require('../services/mockLinkedInProfile.json');

// In-memory fallback for offline mode (no MongoDB)
global.EXAM_MEMORY_STORE = global.EXAM_MEMORY_STORE || {};
global.VERSION_HISTORY = global.VERSION_HISTORY || {};
global.USER_POINTS = global.USER_POINTS || {};

// --- Interview Question Generation ---
const generateInterviewQuestions = (parsedJD, parsedResume, missingSkills) => {
  const questions = [];

  // Technical questions based on JD skills
  (parsedJD.criticalSkills || []).slice(0, 3).forEach(skill => {
    questions.push({
      q: `Describe a production system you built using ${skill}. What were the scaling challenges?`,
      type: 'Technical'
    });
  });

  // Questions about missing skills
  (missingSkills || []).slice(0, 2).forEach(skill => {
    questions.push({
      q: `How would you approach learning ${skill} and applying it in a team environment?`,
      type: 'Growth'
    });
  });

  // Behavioral questions
  questions.push(
    { q: 'Tell me about a time you had to make a critical architecture decision under tight deadlines. What tradeoffs did you make?', type: 'Behavioral' },
    { q: 'Describe a situation where you disagreed with your team lead on a technical approach. How did you handle it?', type: 'Behavioral' },
    { q: 'Walk me through your most impactful project. What metrics did it move?', type: 'Behavioral' }
  );

  return questions.slice(0, 6);
};

// ============================================
// MAIN ANALYSIS PIPELINE
// ============================================
exports.startAnalysis = async (req, res) => {
  try {
    const file = req.file;
    const jdText = req.body.jobDescription;

    if (!file) return res.status(400).json({ success: false, message: 'Resume file is required' });
    if (!jdText) return res.status(400).json({ success: false, message: 'Job description is required' });

    // ---- STEP 1: Extract raw text from PDF/DOCX ----
    const rawResumeText = await extractResumeText({ buffer: file.buffer, mimetype: file.mimetype });

    // ---- STEP 2: Structure extraction via local NLP ----
    const parsedResume = extractStructuredResume(rawResumeText);
    const parsedJD = extractStructuredJD(jdText);

    // ---- STEP 3: Ontology categorization ----
    const resumeCategories = {};
    const jdCategories = {};
    const categoryScores = {};

    parsedResume.skills.forEach(skill => {
      const cat = categorizeSkill(skill);
      if (!resumeCategories[cat]) resumeCategories[cat] = [];
      resumeCategories[cat].push(skill);
    });

    parsedJD.criticalSkills.concat(parsedJD.secondarySkills).forEach(skill => {
      const cat = categorizeSkill(skill);
      if (!jdCategories[cat]) jdCategories[cat] = [];
      jdCategories[cat].push(skill);
    });

    // Calculate category-level scores
    for (const cat of new Set([...Object.keys(resumeCategories), ...Object.keys(jdCategories)])) {
      const resumeCount = (resumeCategories[cat] || []).length;
      const jdCount = (jdCategories[cat] || []).length;
      categoryScores[cat] = jdCount > 0 ? Math.min(100, Math.round((resumeCount / jdCount) * 100)) : 100;
    }

    // ---- STEP 4: Semantic skill matching ----
    // Build an embedding map for semantic matching (using exact text match for offline mode)
    const embeddingsMap = {};
    [...parsedResume.skills, ...parsedJD.criticalSkills, ...parsedJD.secondarySkills].forEach(skill => {
      // Using simple normalized text as "embedding" for exact match fallback
      embeddingsMap[skill.toLowerCase()] = null;
    });

    const semanticMatches = calculateSemanticMatrix(
      parsedResume.skills,
      parsedJD.criticalSkills,
      embeddingsMap
    );

    // ---- STEP 5: ATS Simulation ----
    const atsResults = simulateATS(parsedResume, parsedJD);

    // ---- STEP 6: Dynamic Scoring ----
    const dynamicScore = generateDynamicScore(semanticMatches, atsResults, parsedJD, parsedResume);

    // ---- STEP 7: Insights Engine ----
    const insights = generateInsights(atsResults, semanticMatches, dynamicScore.reasoning);

    // ---- STEP 8: Career Path Intelligence ----
    const careerPath = generateCareerPaths(resumeCategories);

    // ---- STEP 9: Salary Prediction ----
    const marketInsights = predictSalary(parsedResume.skills, parsedJD.requiredExperienceYears);

    // ---- STEP 10: Action Verb Analysis ----
    const verbAnalysis = analyzeActionVerbs(rawResumeText);

    // ---- STEP 11: Build radar data ----
    const radarCategories = ['Frontend Development', 'Backend Development', 'Database & Storage', 'Cloud & DevOps', 'AI & Data Science', 'Core Computer Science'];
    const radarData = radarCategories.map(cat => ({
      subject: cat.replace(' Development', '').replace(' & ', '/'),
      A: categoryScores[cat] || 0,
      fullMark: 100
    }));

    // ---- STEP 12: Missing skills ----
    const resumeSkillsLower = new Set(parsedResume.skills.map(s => s.toLowerCase()));
    const missingSkills = parsedJD.criticalSkills.filter(s => !resumeSkillsLower.has(s.toLowerCase()));

    // ---- STEP 13: Interview Questions ----
    const interviewQuestions = generateInterviewQuestions(parsedJD, parsedResume, missingSkills);
    marketInsights.interviewQuestions = interviewQuestions;

    // ---- STEP 14: Benchmark ----
    const benchmark = calculatePercentile(dynamicScore.overallScore);

    // ---- STEP 15: Version comparison ----
    const userId = req.user.id;
    const previousAnalyses = Object.values(global.EXAM_MEMORY_STORE).filter(a =>
      a.userId && a.userId.toString() === userId
    );
    const previousAnalysis = previousAnalyses.length > 0 ? previousAnalyses[previousAnalyses.length - 1] : null;
    
    const versionComparison = computeVersionDiff(
      { overallScore: dynamicScore.overallScore, resumeSkills: parsedResume.skills },
      previousAnalysis
    );

    // ---- BUILD ANALYSIS DOCUMENT ----
    const analysisData = {
      userId: req.user.id,
      jobDescriptionText: jdText,
      rawResumeText: rawResumeText,
      scores: {
        overallScore: dynamicScore.overallScore,
        atsScore: atsResults.atsScore,
        confidenceScore: dynamicScore.confidenceScore,
        breakdown: dynamicScore.breakdown,
        radar: radarData
      },
      benchmarking: benchmark,
      ontologyData: { resumeCategories, jdCategories, categoryScores },
      careerPath,
      extractedData: { resume: parsedResume },
      suggestions: {
        missingSkills,
        reasoning: dynamicScore.reasoning
      },
      insights: {
        topIssues: insights.topIssues,
        quickWins: insights.quickWins,
        priorityInsights: insights.priorityInsights
      },
      marketInsights,
      verbAnalysis,
      versionComparison,
      aiTracking: {
        tokenUsage: 0,
        apiCostEstimate: 0,
        cachingUsed: false
      }
    };

    // Try to save to MongoDB, fall back to in-memory
    let analysisDoc;
    try {
      analysisDoc = new Analysis(analysisData);
      await analysisDoc.save();
    } catch {
      // Offline mode — use in-memory store
      analysisDoc = { ...analysisData, _id: 'offline-' + Date.now(), createdAt: new Date() };
    }

    global.EXAM_MEMORY_STORE[analysisDoc._id] = analysisDoc;

    // ---- Track version history ----
    if (!global.VERSION_HISTORY[userId]) global.VERSION_HISTORY[userId] = [];
    global.VERSION_HISTORY[userId].push({
      id: analysisDoc._id,
      overallScore: dynamicScore.overallScore,
      atsScore: atsResults.atsScore,
      skills: parsedResume.skills,
      date: new Date().toISOString(),
      versionComparison
    });

    // ---- Award gamification points ----
    if (!global.USER_POINTS[userId]) global.USER_POINTS[userId] = 0;
    global.USER_POINTS[userId] += 10; // 10 points per analysis
    if (dynamicScore.overallScore >= 80) global.USER_POINTS[userId] += 5; // bonus for high score

    res.status(200).json({
      success: true,
      analysisId: analysisDoc._id,
      data: analysisDoc,
      points: global.USER_POINTS[userId]
    });
  } catch (err) {
    console.error('Analysis Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================
// EXCEL EXPORT
// ============================================
exports.downloadExcel = async (req, res) => {
  try {
    const userId = req.user.id;
    let analysis;
    try {
      analysis = await Analysis.findOne({ _id: req.params.id, userId });
    } catch {
      analysis = global.EXAM_MEMORY_STORE[req.params.id];
      if (analysis && String(analysis.userId) !== String(userId)) {
        analysis = null;
      }
    }

    if (!analysis) {
      analysis = global.EXAM_MEMORY_STORE[req.params.id];
      if (analysis && String(analysis.userId) !== String(userId)) {
        analysis = null;
      }
    }

    if (!analysis) return res.status(404).json({ success: false, message: 'Analysis record not found' });

    const buffer = await generateExcelReport(analysis);

    res.setHeader('Content-Disposition', 'attachment; filename="Elite_Resume_Report.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================
// COVER LETTER GENERATION
// ============================================
exports.generateCoverLetter = async (req, res) => {
  try {
    const userId = req.user.id;
    let analysis;
    try {
      analysis = await Analysis.findOne({ _id: req.params.id, userId });
    } catch {
      analysis = global.EXAM_MEMORY_STORE[req.params.id];
      if (analysis && String(analysis.userId) !== String(userId)) {
        analysis = null;
      }
    }

    if (!analysis) {
      analysis = global.EXAM_MEMORY_STORE[req.params.id];
      if (analysis && String(analysis.userId) !== String(userId)) {
        analysis = null;
      }
    }

    if (!analysis) return res.status(404).json({ success: false, message: 'Analysis not found' });

    const name = analysis.extractedData?.resume?.personalInfo?.name || 'Candidate';
    const skills = analysis.extractedData?.resume?.skills || [];
    const score = analysis.scores?.overallScore || 0;
    const topSkills = skills.slice(0, 5).join(', ');
    const benchmark = analysis.benchmarking?.category || 'Strong';

    const coverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the open position at your organization. Having reviewed the job description thoroughly, I am confident that my professional background and technical expertise make me an exceptional fit for this role.

My core competencies include ${topSkills}, which directly align with the requirements outlined in your posting. Through my career, I have consistently delivered high-impact results — my professional profile scores in the ${benchmark} category among industry peers, demonstrating a strong track record of technical excellence.

Key highlights of my qualifications:

• Deep expertise in ${skills.slice(0, 3).join(', ')} with proven production experience
• ${skills.length}+ technologies in my technical arsenal spanning multiple domains
• Consistent track record of delivering scalable, maintainable solutions
• Strong analytical mindset with a focus on data-driven decision making

Based on my comprehensive career analysis (Elite Score: ${score}/100), I bring the technical depth and breadth that organizations seek in senior engineering talent. I am particularly excited about the opportunity to contribute to your team's mission and drive meaningful technical impact.

I would welcome the opportunity to discuss how my skills and experience can contribute to your team's success. I am available for an interview at your earliest convenience.

Thank you for your time and consideration.

Best regards,
${name}`;

    res.status(200).json({ success: true, coverLetter });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================
// VERSION HISTORY
// ============================================
exports.getVersionHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = global.VERSION_HISTORY[userId] || [];
    res.status(200).json({ success: true, history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================
// LINKEDIN SYNC (MOCK)
// ============================================
exports.syncLinkedIn = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      linkedinData: mockLinkedIn,
      message: 'LinkedIn profile synchronized successfully.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================
// USER POINTS (GAMIFICATION)
// ============================================
exports.getUserPoints = async (req, res) => {
  try {
    const userId = req.user.id;
    const points = global.USER_POINTS[userId] || 0;

    let tier = 'Bronze';
    if (points >= 100) tier = 'Diamond';
    else if (points >= 50) tier = 'Gold';
    else if (points >= 20) tier = 'Silver';

    res.status(200).json({ success: true, points, tier });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
