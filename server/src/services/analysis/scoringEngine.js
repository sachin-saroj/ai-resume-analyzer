const { calculatePercentile } = require('../../metrics/benchmarkEngine');

/**
 * Advanced Dynamic Scoring Engine
 * Computes scores dynamically based on critical skills, ATS formatting,
 * experience duration relevance, and project portfolio signals.
 */
const generateDynamicScore = (semanticMatches, atsResults, parsedJD, parsedResume = {}) => {
  let overallScore = 0;
  const reasoning = [];
  
  // Weights (Dynamic based on Elite Plan)
  const weights = {
    criticalSkills: 0.40,
    atsSimulation: 0.30,
    experienceRelevance: 0.20,
    projectsRelevance: 0.10
  };

  // 1. Skill Match Logic
  const matrixScore = semanticMatches.matrixScore || 0; // out of 100
  let skillComponent = matrixScore * weights.criticalSkills;
  
  // Critical Penalty Logic
  const missedCritical = semanticMatches.matches.filter(m => m.score < 0.6).length;
  if (missedCritical > 0) {
    reasoning.push(`Heavy penalty (-${missedCritical * 5}): Missing ${missedCritical} mandatory critical skills defined by the Job Description.`);
    skillComponent -= (missedCritical * 5); 
  } else {
    reasoning.push(`Excellent critical skill match: Found strong overlapping technologies.`);
  }
  
  // 2. ATS Results
  const atsScore = atsResults.atsScore || 0;
  const atsComponent = atsScore * weights.atsSimulation;
  if (atsScore < 70) {
    if (atsResults.issues && atsResults.issues.length > 0) {
      reasoning.push(`ATS structure is severely limiting your visibility: ${atsResults.issues[0]}`);
    } else {
      reasoning.push(`ATS structure issues detected (formatting, structure, or sections).`);
    }
  }

  // 3. Experience Relevance Logic (Calculated dynamically)
  let totalYears = 0;
  const roles = parsedResume.experienceRoles || [];
  roles.forEach(role => {
    const duration = role.duration;
    let years = 1.5; // Default fallback per role block
    if (duration) {
      // Matches year patterns like 2018 - 2021 or 2020 - Present
      const match = duration.match(/(\d{4})\s*[-–—to]+\s*(\d{4}|present)/i);
      if (match) {
        const start = parseInt(match[1]);
        const end = match[2].toLowerCase() === 'present' ? new Date().getFullYear() : parseInt(match[2]);
        if (start && end && end >= start) {
          years = Math.max(1, end - start);
        }
      }
    }
    totalYears += years;
  });

  let expScore = 60; // baseline
  if (parsedJD.requiredExperienceYears) {
    const req = parsedJD.requiredExperienceYears;
    if (totalYears >= req) {
      expScore = 100;
      reasoning.push(`Excellent experience coverage: You have ${Math.round(totalYears)} years of experience, exceeding the required ${req} years.`);
    } else {
      expScore = Math.max(30, Math.round((totalYears / req) * 100));
      reasoning.push(`Experience gap: You have ${Math.round(totalYears)} years of experience, but the role requests ${req} years.`);
    }
  } else {
    if (totalYears >= 5) {
      expScore = 100;
      reasoning.push(`Strong senior-level experience detected: ${Math.round(totalYears)} years total.`);
    } else if (totalYears >= 3) {
      expScore = 90;
      reasoning.push(`Solid mid-level experience detected: ${Math.round(totalYears)} years total.`);
    } else if (totalYears >= 1) {
      expScore = 75;
      reasoning.push(`Junior-level experience detected: ${Math.round(totalYears)} years total.`);
    } else {
      expScore = 40;
      reasoning.push(`Minimal professional experience detected: ${Math.round(totalYears)} years total.`);
    }
  }
  const expComponent = expScore * weights.experienceRelevance;

  // 4. Projects Relevance Logic (Calculated dynamically)
  const projects = parsedResume.projects || [];
  let projScore = 40; // Default baseline if 0 projects
  
  if (projects.length > 0) {
    if (projects.length === 1) {
      projScore = 65;
      reasoning.push(`Found 1 project in your portfolio.`);
    } else if (projects.length === 2) {
      projScore = 80;
      reasoning.push(`Found 2 projects in your portfolio.`);
    } else {
      projScore = 90;
      reasoning.push(`Robust portfolio: Found ${projects.length} projects.`);
    }

    // Technology match bonus
    const jdSkillsLower = new Set((parsedJD.criticalSkills || []).map(s => s.toLowerCase()));
    let matchingProjectTechsCount = 0;
    projects.forEach(p => {
      (p.technologies || []).forEach(t => {
        if (jdSkillsLower.has(t.toLowerCase())) {
          matchingProjectTechsCount++;
        }
      });
    });

    const bonus = Math.min(10, matchingProjectTechsCount * 2);
    if (bonus > 0) {
      projScore = Math.min(100, projScore + bonus);
      reasoning.push(`Project tech stack bonus (+${bonus}%): Projects feature skills defined in the Job Description.`);
    }
  } else {
    reasoning.push(`Portfolio gap: Consider adding detailed technical projects to showcase your skills.`);
  }
  const projComponent = projScore * weights.projectsRelevance;

  // Final overall score calculation
  overallScore = skillComponent + atsComponent + expComponent + projComponent;
  overallScore = Math.max(0, Math.min(100, Math.round(overallScore)));

  // Generate percentiles
  const benchmark = calculatePercentile(overallScore);

  return {
    overallScore,
    confidenceScore: atsResults.confidenceScore,
    breakdown: {
      skills: Math.max(0, Math.round(skillComponent / weights.criticalSkills)),
      experience: expScore,
      projects: projScore,
      formatting: atsScore
    },
    reasoning,
    benchmark
  };
};

module.exports = { generateDynamicScore };
