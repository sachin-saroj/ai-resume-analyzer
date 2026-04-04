/**
 * Ranked Insight Engine
 * Generates Top Issues and Quick Wins, and prioritizes them based on severity.
 */

const generateInsights = (atsResults, semanticMatches, dynamicScoreReasoning) => {
  const priorityInsights = [];
  const topIssues = [];
  const quickWins = [];

  // Priority 1: High Impact (Missing Critical Skills)
  const missingCritical = semanticMatches.matches.filter(m => m.score < 0.6);
  if (missingCritical.length > 0) {
    topIssues.push(`Missing ${missingCritical.length} critical skills.`);
    missingCritical.slice(0, 3).forEach(m => {
      priorityInsights.push({
        issue: `Missing critical skill: ${m.jdSkill}`,
        impact: 'high',
        fix: `Implement a project or highlight past experience involving ${m.jdSkill}.`
      });
    });
  }

  // Priority 2: Medium/High Impact (ATS Sections missing)
  if (atsResults.atsScore < 80) {
    atsResults.issues.forEach(issue => {
      priorityInsights.push({
        issue: issue,
        impact: 'high',
        fix: 'Restructure resume to explicitly include the missing standard sections or rectify dense formatting.'
      });
      topIssues.push(issue);
    });
  }

  // Quick Wins (Low Effort / Medium Impact)
  const formattingIssues = atsResults.issues.filter(i => i.toLowerCase().includes('formatting'));
  if (formattingIssues.length > 0) {
    quickWins.push("Convert paragraph descriptions into 3-5 punchy bullet points.");
    priorityInsights.push({
      issue: 'Dense paragraphs detected',
      impact: 'low',
      fix: 'Convert paragraphs into bullet points starting with action verbs.'
    });
  }
  
  if (semanticMatches.matrixScore > 70 && atsResults.atsScore > 80) {
    quickWins.push("Ensure contact info and LinkedIn links are absolutely clear and clickable.");
  }

  return {
    topIssues: topIssues.slice(0, 3),
    quickWins: quickWins.slice(0, 3),
    priorityInsights
  };
};

module.exports = { generateInsights };
