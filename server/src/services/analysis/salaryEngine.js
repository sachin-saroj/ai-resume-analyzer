const salaryTiers = require('./salaryTiers.json');
const { categorizeSkill } = require('../ontology/skillOntology');

/**
 * Salary Prediction Engine
 * Maps extracted resume skills to FAANG salary bands using the static tier data.
 */

const predictSalary = (resumeSkills, experienceYears = null) => {
  // 1. Determine seniority band from experience years
  let bandKey = 'L4_MidLevel'; // default
  if (experienceYears !== null) {
    if (experienceYears <= 2) bandKey = 'L3_Entry';
    else if (experienceYears <= 5) bandKey = 'L4_MidLevel';
    else if (experienceYears <= 10) bandKey = 'L5_Senior';
    else if (experienceYears <= 15) bandKey = 'L6_Staff';
    else bandKey = 'L7_Principal';
  } else {
    // Estimate from skill count as a heuristic
    const skillCount = resumeSkills.length;
    if (skillCount <= 3) bandKey = 'L3_Entry';
    else if (skillCount <= 8) bandKey = 'L4_MidLevel';
    else if (skillCount <= 15) bandKey = 'L5_Senior';
    else bandKey = 'L6_Staff';
  }

  const band = salaryTiers.bands[bandKey];

  // 2. Calculate dominant skill multiplier
  const categoryCounts = {};
  resumeSkills.forEach(skill => {
    const cat = categorizeSkill(skill);
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  // Find dominant category
  let dominantCategory = 'Frontend Development';
  let maxCount = 0;
  for (const [cat, count] of Object.entries(categoryCounts)) {
    if (count > maxCount) {
      maxCount = count;
      dominantCategory = cat;
    }
  }

  const multiplier = salaryTiers.skillMultipliers[dominantCategory] || 1.0;

  // 3. Compute final salary range
  const min = Math.round(band.min * multiplier / 1000) * 1000;
  const max = Math.round(band.max * multiplier / 1000) * 1000;
  const median = Math.round(band.median * multiplier / 1000) * 1000;

  // Determine confidence based on data quality
  let confidence = 'Medium';
  if (resumeSkills.length >= 5 && experienceYears !== null) confidence = 'High';
  else if (resumeSkills.length < 3) confidence = 'Low';

  return {
    salaryPrediction: {
      min: `$${min.toLocaleString()}`,
      max: `$${max.toLocaleString()}`,
      median: `$${median.toLocaleString()}`,
      currency: 'USD',
      confidence,
      band: band.label,
      dominantSkillArea: dominantCategory,
      multiplierApplied: multiplier
    }
  };
};

module.exports = { predictSalary };
