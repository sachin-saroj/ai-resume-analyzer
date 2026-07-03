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
 * Normalizes skill strings for robust local matching.
 * e.g. "React.js" -> "react", "ReactJS" -> "react"
 */
const normalizeSkill = (skill) => {
  return skill.toLowerCase()
    .replace(/[^a-z0-9\+\#]/g, '') // Keep + and # for languages like C++, C#
    .replace(/js$/, '')            // Remove trailing "js"
    .trim();
};

/**
 * Common technical synonyms and acronym mappings.
 */
const SYNONYMS = {
  'js': 'javascript',
  'javascript': 'js',
  'ts': 'typescript',
  'typescript': 'ts',
  'react': 'reactjs',
  'reactjs': 'react',
  'node': 'nodejs',
  'nodejs': 'node',
  'mongo': 'mongodb',
  'mongodb': 'mongo',
  'postgres': 'postgresql',
  'postgresql': 'postgres',
  'aws': 'amazon web services',
  'gcp': 'google cloud platform',
  'azure': 'microsoft azure',
  'ml': 'machine learning',
  'ai': 'artificial intelligence'
};

/**
 * Languages or skills that look similar but are completely different.
 */
const EXCLUSIONS = new Set([
  'java|javascript',
  'javascript|java',
  'js|java',
  'java|js',
  'c|c++',
  'c++|c',
  'c|c#',
  'c#|c',
  'c++|c#',
  'c#|c++',
  'python|cython',
  'cython|python'
]);

/**
 * Computes the Jaro-Winkler similarity score between two strings.
 */
const calculateJaroWinkler = (s1, s2) => {
  s1 = s1.trim().toLowerCase();
  s2 = s2.trim().toLowerCase();
  
  if (s1 === s2) return 1.0;
  
  const len1 = s1.length;
  const len2 = s2.length;
  
  const matchWindow = Math.floor(Math.max(len1, len2) / 2) - 1;
  const matches1 = new Array(len1).fill(false);
  const matches2 = new Array(len2).fill(false);
  
  let matches = 0;
  let transpositions = 0;
  
  for (let i = 0; i < len1; i++) {
    const start = Math.max(0, i - matchWindow);
    const end = Math.min(len2 - 1, i + matchWindow);
    
    for (let j = start; j <= end; j++) {
      if (!matches2[j] && s1[i] === s2[j]) {
        matches1[i] = true;
        matches2[j] = true;
        matches++;
        break;
      }
    }
  }
  
  if (matches === 0) return 0.0;
  
  let k = 0;
  for (let i = 0; i < len1; i++) {
    if (matches1[i]) {
      while (!matches2[k]) k++;
      if (s1[i] !== s2[k]) transpositions++;
      k++;
    }
  }
  
  const jaro = (matches / len1 + matches / len2 + (matches - transpositions / 2) / matches) / 3;
  
  let prefix = 0;
  for (let i = 0; i < Math.min(4, Math.min(len1, len2)); i++) {
    if (s1[i] === s2[i]) prefix++;
    else break;
  }
  
  return jaro + prefix * 0.1 * (1 - jaro);
};

/**
 * Computes a local similarity score between two technical skills.
 */
const computeLocalSimilarity = (s1, s2) => {
  const n1 = s1.toLowerCase().trim();
  const n2 = s2.toLowerCase().trim();
  
  if (n1 === n2) return 1.0;
  
  // Check exclusions list to prevent false positives (like Java vs Javascript)
  if (EXCLUSIONS.has(`${n1}|${n2}`)) return 0.0;
  
  // Check normalized strings (handles dots, dashes, casing, and trailing "js")
  const norm1 = normalizeSkill(s1);
  const norm2 = normalizeSkill(s2);
  if (norm1 === norm2) return 1.0;
  
  // Check common technical synonyms
  if (SYNONYMS[norm1] === norm2 || SYNONYMS[norm2] === norm1 || SYNONYMS[n1] === n2 || SYNONYMS[n2] === n1) {
    return 1.0;
  }
  
  // Calculate Jaro-Winkler similarity
  const jw = calculateJaroWinkler(n1, n2);
  
  // Only accept JW scores above a high confidence threshold (0.83) to prevent noisy matches
  return jw >= 0.83 ? jw : 0.0;
};

/**
 * Calculates skill-to-skill similarity matrices.
 * Uses OpenAI embeddings if present, otherwise falls back to a highly robust
 * local fuzzy-string and synonym matching engine.
 */
const calculateSemanticMatrix = (resumeSkills, jdSkills, embeddingsMap) => {
  const matches = [];
  let totalScore = 0;

  jdSkills.forEach(jdSkill => {
    let bestMatchScore = 0;
    let optimalMatch = null;
    
    const jdVec = embeddingsMap ? embeddingsMap[jdSkill.toLowerCase()] : null;
    
    resumeSkills.forEach(resumeSkill => {
      const resVec = embeddingsMap ? embeddingsMap[resumeSkill.toLowerCase()] : null;
      if (jdVec && resVec) {
        const score = cosineSimilarity(jdVec, resVec);
        if (score > bestMatchScore) {
          bestMatchScore = score;
          optimalMatch = resumeSkill;
        }
      } else {
        // Local intelligent fuzzy and synonym matcher fallback
        const similarityScore = computeLocalSimilarity(jdSkill, resumeSkill);
        if (similarityScore > bestMatchScore) {
          bestMatchScore = similarityScore;
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
  calculateSemanticMatrix,
  computeLocalSimilarity
};
