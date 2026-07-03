/**
 * Normalizes an overall score and calculates FAANG-tier percentile ranking.
 */

const calculatePercentile = (overallScore) => {
  // Using a simulated normal distribution for MVP
  // Mean: 65, Std Dev: 15
  // We approximate the CDF of normal distribution
  
  const mean = 65;
  const stdDev = 15;
  const zScore = (overallScore - mean) / stdDev;
  
  // Approximate error function for normal CDF
  const sign = zScore < 0 ? -1 : 1;
  const x = Math.abs(zScore) / Math.sqrt(2);
  const t = 1.0 / (1.0 + 0.3275911 * x);
  const erf = sign * (1.0 - (((((1.061405429 * t + -1.453152027) * t) + 1.421413741) * t + -0.284496736) * t + 0.254829592) * t * Math.exp(-x * x));
  
  let percentile = Math.round((0.5 * (1 + erf)) * 100);
  
  // Cap at realistic boundaries
  if (percentile > 99) percentile = 99;
  if (percentile < 1) percentile = 1;

  let category = 'Average';
  let explanation = '';

  if (percentile >= 90) {
    category = 'Top 10%';
    explanation = `Elite tier. Estimated score ranks in top 10% based on statistical heuristics. Highly positioned to pass FAANG ATS screens.`;
  } else if (percentile >= 75) {
    category = 'Top 25%';
    explanation = `Strong resume. Estimated score ranks in top 25% based on statistical heuristics. Consider tweaking minor formatting.`;
  } else if (percentile >= 40) {
    category = 'Average';
    explanation = `Estimated score ranks in middle of the pack (Top ${100 - percentile}%). Address critical skill gaps to stand out.`;
  } else {
    category = 'Below Average';
    explanation = `High risk of ATS rejection. Estimated score ranks in below average band. Immediate action required on missing critical skills.`;
  }

  return {
    percentile,
    category,
    explanation,
    disclaimer: 'Estimated score band (heuristic, not based on real candidate data)'
  };
};

module.exports = { calculatePercentile };
