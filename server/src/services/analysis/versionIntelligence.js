/**
 * Resume Version Intelligence
 * Compares the current analysis against the previous analysis for the same user/JD combo.
 */

const computeVersionDiff = (currentAnalysis, previousAnalysis) => {
  if (!previousAnalysis) {
    return {
      scoreChange: 0,
      skillsAdded: [],
      skillsRemoved: []
    };
  }

  const scoreChange = currentAnalysis.overallScore - previousAnalysis.scores.overallScore;
  
  const currentSkills = new Set(currentAnalysis.resumeSkills || []);
  const prevSkills = new Set(previousAnalysis.extractedData?.resume?.skills || []);

  const skillsAdded = [...currentSkills].filter(x => !prevSkills.has(x));
  const skillsRemoved = [...prevSkills].filter(x => !currentSkills.has(x));

  return {
    scoreChange,
    skillsAdded,
    skillsRemoved
  };
};

module.exports = { computeVersionDiff };
