/**
 * Career Path Intelligence
 * Takes in the categorized skill ontology from the user's resume and maps out potential role pivots.
 */

const ROLE_PROFILES = [
  { role: 'Frontend Engineer', core: ['Frontend Development'], secondary: ['Backend Development'] },
  { role: 'Backend Engineer', core: ['Backend Development', 'Database & Storage'], secondary: ['Cloud & DevOps'] },
  { role: 'Full Stack Engineer', core: ['Frontend Development', 'Backend Development'], secondary: ['Database & Storage'] },
  { role: 'DevOps Engineer', core: ['Cloud & DevOps'], secondary: ['Backend Development'] },
  { role: 'Data Scientist', core: ['AI & Data Science', 'Database & Storage'], secondary: ['Backend Development'] },
];

const generateCareerPaths = (resumeCategories) => {
  const recommendedRoles = [];
  const reasoning = [];

  // Determine user's top categories
  const categories = Object.keys(resumeCategories);
  
  ROLE_PROFILES.forEach(profile => {
    let coreMatched = 0;
    profile.core.forEach(req => {
      if (categories.includes(req) && resumeCategories[req].length >= 3) {
        coreMatched++;
      }
    });

    if (coreMatched === profile.core.length) {
      recommendedRoles.push(profile.role);
      reasoning.push(`Strong alignment with ${profile.role} due to solid expertise in ${profile.core.join(' and ')}.`);
    } else if (coreMatched > 0) {
      let secondaryMatched = profile.secondary.some(s => categories.includes(s));
      if (secondaryMatched) {
        recommendedRoles.push(`${profile.role} (Pivot)`);
        reasoning.push(`You have foundational skills for ${profile.role}, but need to strengthen your core in ${profile.core.filter(req => !categories.includes(req)).join(', ')}.`);
      }
    }
  });

  // Fallback
  if (recommendedRoles.length === 0) {
    reasoning.push("You have a highly generalized profile. Consider focusing deeply on a specific track like 'Frontend' or 'Backend' to increase visibility.");
  }

  return { recommendedRoles, reasoning };
};

module.exports = { generateCareerPaths };
