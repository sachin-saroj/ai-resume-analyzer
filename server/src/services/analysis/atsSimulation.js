/**
 * Real ATS Simulation Engine (Rule-based constraints)
 */

const simulateATS = (parsedResume, parsedJD) => {
  let atsScore = 100;
  const issues = [];
  let confidenceScore = 100;

  // 1. Section Presence
  if (!parsedResume.skills || parsedResume.skills.length === 0) {
    atsScore -= 20;
    confidenceScore -= 10;
    issues.push('Missing explicit "Skills" section or unable to parse skills.');
  }

  if (!parsedResume.experienceRoles || parsedResume.experienceRoles.length === 0) {
    atsScore -= 25;
    confidenceScore -= 10;
    issues.push('Missing professional Experience roles. ATS requires chronological experience.');
  }

  if (!parsedResume.education || parsedResume.education.length === 0) {
    atsScore -= 10;
    issues.push('Missing Education section. Many ATS aggressively filter out candidates without listed degrees.');
  }

  // 2. Formatting & Density Heuristics
  // Check if candidate wrote paragraphs instead of bullets (we check description lengths vs bullet counts hypothetically)
  let tooLongParagraphs = 0;
  (parsedResume.experienceRoles || []).forEach(role => {
    if (role.description && role.description.split('.').length > 5 && !role.description.includes('-')) {
      tooLongParagraphs++;
    }
  });

  if (tooLongParagraphs > 0) {
    atsScore -= 10;
    issues.push('Formatting Issue: Detected dense paragraphs in Experience. ATS and recruiters prefer bulleted lists for readability.');
  }

  // Calculate generic Keyword presence vs JD requirements
  const rawTextDensity = JSON.stringify(parsedResume).toLowerCase();
  let missingCritical = 0;
  (parsedJD.criticalSkills || []).forEach(skill => {
    if (!rawTextDensity.includes(skill.toLowerCase())) {
      missingCritical++;
    }
  });

  if (missingCritical > 0) {
    const penalty = (missingCritical * 5);
    atsScore -= penalty;
    issues.push(`Keyword Absence: Missing exact text matches for ${missingCritical} critical skills requested in the Job Description.`);
  }

  return {
    atsScore: Math.max(0, atsScore),
    confidenceScore: Math.max(50, confidenceScore), // Ensure it acts failure-tolerant
    issues
  };
};

module.exports = { simulateATS };
