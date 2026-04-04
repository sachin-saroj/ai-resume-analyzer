/**
 * Computes cosine similarity between two 1536-dimensional vectors.
 */
const cosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

/**
 * Mocks the OpenAI logic for now, but structures the matrix semantic matching
 * Calculates skill-to-skill similarity matrices.
 */
const calculateSemanticMatrix = (resumeSkills, jdSkills, embeddingsMap) => {
  const matches = [];
  let totalScore = 0;

  // For every critical JD skill, find the best semantic match in the resume
  jdSkills.forEach(jdSkill => {
    let bestMatchScore = 0;
    let optimalMatch = null;
    
    // Assuming embeddingsMap pre-fetched OpenAI embeddings for both arrays
    const jdVec = embeddingsMap[jdSkill.toLowerCase()];
    
    resumeSkills.forEach(resumeSkill => {
      const resVec = embeddingsMap[resumeSkill.toLowerCase()];
      if (jdVec && resVec) {
        const score = cosineSimilarity(jdVec, resVec);
        if (score > bestMatchScore) {
          bestMatchScore = score;
          optimalMatch = resumeSkill;
        }
      } else {
        // Fallback exact text match if tokenization/embedding failed
        if (jdSkill.toLowerCase() === resumeSkill.toLowerCase()) {
          bestMatchScore = 1.0;
          optimalMatch = resumeSkill;
        }
      }
    });

    matches.push({ jdSkill, optimalMatch, score: bestMatchScore });
    totalScore += bestMatchScore;
  });

  const matrixScore = jdSkills.length > 0 ? (totalScore / jdSkills.length) * 100 : 0;
  
  return {
    matrixScore,
    matches
  };
};

module.exports = {
  cosineSimilarity,
  calculateSemanticMatrix
};
