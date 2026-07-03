const { extractStructuredResume, extractStructuredJD } = require('../services/parsing/localExtractor');
const { calculateSemanticMatrix } = require('../services/analysis/semanticMatching');
const { generateDynamicScore } = require('../services/analysis/scoringEngine');
const { calculatePercentile } = require('../metrics/benchmarkEngine');

const runTest = (name, fn) => {
  try {
    fn();
    console.log(`\x1b[32m✓ PASSED: ${name}\x1b[0m`);
  } catch (err) {
    console.error(`\x1b[31m✗ FAILED: ${name}\x1b[0m`);
    console.error(err);
    process.exit(1);
  }
};

console.log('🧪 Running Resume Analyzer Test Suite...\n');

runTest('Local Extractor - Skills Extraction', () => {
  const resumeText = 'Skills: ReactJS, Python, Java, Docker, Machine Learning';
  const data = extractStructuredResume(resumeText);
  const skills = data.skills;
  if (!skills.includes('React') && !skills.includes('ReactJS') && !skills.includes('Reactjs')) {
    throw new Error('Expected React skill to be extracted');
  }
  if (!skills.includes('Python')) throw new Error('Expected Python skill to be extracted');
});

runTest('Local Extractor - Resilient Experience Fallback', () => {
  const resumeText = 'This is a creative resume layout without clear experience headers.';
  const data = extractStructuredResume(resumeText);
  if (data.experienceRoles.length === 0) {
    throw new Error('Expected at least one fallback experience role for non-standard formats');
  }
});

runTest('Semantic Matching - Synonym Mapping & Jaro-Winkler', () => {
  const resumeSkills = ['ReactJS', 'ML'];
  const jdSkills = ['React', 'Machine Learning'];
  const embeddingsMap = {};
  [...resumeSkills, ...jdSkills].forEach(s => {
    embeddingsMap[s.toLowerCase()] = null;
  });
  
  const matches = calculateSemanticMatrix(resumeSkills, jdSkills, embeddingsMap);
  const reactMatch = matches.matches.find(m => m.jdSkill === 'React');
  const mlMatch = matches.matches.find(m => m.jdSkill === 'Machine Learning');

  if (!reactMatch || reactMatch.score < 0.9) {
    throw new Error('Expected synonym match between ReactJS and React');
  }
  if (!mlMatch || mlMatch.score < 0.9) {
    throw new Error('Expected synonym match between ML and Machine Learning');
  }
});

runTest('Semantic Matching - Exclusions Rules (Java vs JavaScript)', () => {
  const resumeSkills = ['Java'];
  const jdSkills = ['JavaScript'];
  const embeddingsMap = {};
  [...resumeSkills, ...jdSkills].forEach(s => {
    embeddingsMap[s.toLowerCase()] = null;
  });

  const matches = calculateSemanticMatrix(resumeSkills, jdSkills, embeddingsMap);
  const jsMatch = matches.matches.find(m => m.jdSkill === 'JavaScript');
  if (jsMatch && jsMatch.score > 0.4) {
    throw new Error('Java should not false-match to JavaScript');
  }
});

runTest('Dynamic Scoring - Realistic Experience Relevance', () => {
  const parsedJD = { criticalSkills: ['Python'], requiredExperienceYears: 3 };
  const parsedResume = {
    experienceRoles: [
      { title: 'Engineer', duration: '2020 - 2024' } // 4 years
    ],
    projects: []
  };
  const semanticMatches = { matrixScore: 80, matches: [{ score: 0.8 }] };
  const atsResults = { atsScore: 90 };

  const score = generateDynamicScore(semanticMatches, atsResults, parsedJD, parsedResume);
  if (score.breakdown.experience !== 100) {
    throw new Error('Expected perfect experience score of 100 for 4 years experience against 3 required');
  }
});

runTest('Benchmark Engine - Heuristic Percentiles', () => {
  const percentile90 = calculatePercentile(95);
  const percentileBelow = calculatePercentile(30);

  if (percentile90.category !== 'Top 10%') {
    throw new Error('Score 95 should rank in Top 10%');
  }
  if (!percentileBelow.disclaimer) {
    throw new Error('Percentile response should return a transparent disclaimer notice');
  }
});

console.log('\n\x1b[32m✨ All tests passed successfully!\x1b[0m');
