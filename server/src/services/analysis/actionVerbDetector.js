/**
 * Action Verb Detector — NLP Module
 * Isolates weak vs strong action verbs in resume text using regex patterns.
 * Returns analysis with highlighted text positions.
 */

const STRONG_VERBS = [
  'achieved', 'accelerated', 'architected', 'automated', 'built', 'championed',
  'consolidated', 'created', 'delivered', 'designed', 'developed', 'directed',
  'drove', 'earned', 'eliminated', 'engineered', 'established', 'exceeded',
  'executed', 'expanded', 'forged', 'founded', 'generated', 'grew',
  'headed', 'implemented', 'improved', 'increased', 'influenced', 'initiated',
  'innovated', 'integrated', 'launched', 'led', 'managed', 'maximized',
  'mentored', 'negotiated', 'optimized', 'orchestrated', 'overhauled',
  'partnered', 'pioneered', 'produced', 'propelled', 'quadrupled',
  'redesigned', 'reduced', 'refactored', 'resolved', 'restructured',
  'revamped', 'revolutionized', 'scaled', 'secured', 'simplified',
  'spearheaded', 'streamlined', 'strengthened', 'surpassed', 'synthesized',
  'transformed', 'tripled', 'upgraded', 'visualized'
];

const WEAK_VERBS = [
  'helped', 'assisted', 'worked on', 'was responsible for', 'handled',
  'participated in', 'contributed to', 'involved in', 'dealt with',
  'utilized', 'used', 'did', 'made', 'got', 'went', 'put',
  'tried', 'attempted', 'was part of', 'served as', 'acted as',
  'tasked with', 'given', 'shown', 'told', 'asked', 'allowed'
];

const PASSIVE_PATTERNS = [
  /was\s+\w+ed\b/gi,
  /were\s+\w+ed\b/gi,
  /been\s+\w+ed\b/gi,
  /being\s+\w+ed\b/gi,
  /is\s+\w+ed\b/gi,
  /are\s+\w+ed\b/gi
];

/**
 * Analyzes resume text for action verb quality.
 * Returns structured analysis with verb classifications and text annotations.
 */
const analyzeActionVerbs = (resumeText) => {
  const sentences = resumeText.split(/[.\n]+/).map(s => s.trim()).filter(s => s.length > 5);
  const strongFound = [];
  const weakFound = [];
  const passiveFound = [];
  const annotations = [];

  sentences.forEach((sentence, idx) => {
    const lowerSentence = sentence.toLowerCase();
    const words = lowerSentence.split(/\s+/);

    // Check first 3 words for action verbs (bullet point start)
    const leadWords = words.slice(0, 4);

    // Detect strong verbs
    STRONG_VERBS.forEach(verb => {
      if (leadWords.includes(verb) || lowerSentence.startsWith(verb)) {
        strongFound.push({ verb, sentence: sentence.substring(0, 120), sentenceIndex: idx });
        annotations.push({
          text: sentence.substring(0, 120),
          type: 'strong',
          verb,
          sentenceIndex: idx,
          color: '#10b981' // green
        });
      }
    });

    // Detect weak verbs
    WEAK_VERBS.forEach(verb => {
      const verbRegex = new RegExp(`(?:^|\\s)${verb.replace(/\s+/g, '\\s+')}(?:\\s|$)`, 'i');
      if (verbRegex.test(lowerSentence)) {
        weakFound.push({ verb, sentence: sentence.substring(0, 120), sentenceIndex: idx });
        annotations.push({
          text: sentence.substring(0, 120),
          type: 'weak',
          verb,
          suggestion: getSuggestion(verb),
          sentenceIndex: idx,
          color: '#ef4444' // red
        });
      }
    });

    // Detect passive voice
    PASSIVE_PATTERNS.forEach(pattern => {
      const matches = sentence.match(pattern);
      if (matches) {
        matches.forEach(match => {
          passiveFound.push({ match, sentence: sentence.substring(0, 120), sentenceIndex: idx });
          annotations.push({
            text: sentence.substring(0, 120),
            type: 'passive',
            verb: match,
            suggestion: 'Rewrite using active voice with a strong action verb.',
            sentenceIndex: idx,
            color: '#f59e0b' // amber
          });
        });
      }
    });
  });

  // Deduplicate annotations by sentenceIndex (keep most impactful)
  const seen = new Set();
  const uniqueAnnotations = annotations.filter(a => {
    const key = `${a.sentenceIndex}-${a.type}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Calculate verb score
  const totalBullets = sentences.filter(s => s.length > 15).length || 1;
  const strongRatio = strongFound.length / totalBullets;
  const weakRatio = weakFound.length / totalBullets;
  const verbScore = Math.max(0, Math.min(100, Math.round((strongRatio * 100) - (weakRatio * 50) + 50)));

  return {
    verbScore,
    stats: {
      totalSentences: sentences.length,
      strongVerbCount: strongFound.length,
      weakVerbCount: weakFound.length,
      passiveVoiceCount: passiveFound.length
    },
    strongVerbs: strongFound.slice(0, 10),
    weakVerbs: weakFound.slice(0, 10),
    passiveVoice: passiveFound.slice(0, 5),
    annotations: uniqueAnnotations.slice(0, 30),
    overallGrade: verbScore >= 80 ? 'A' : verbScore >= 60 ? 'B' : verbScore >= 40 ? 'C' : 'D',
    recommendation: getRecommendation(verbScore, weakFound.length, passiveFound.length)
  };
};

function getSuggestion(weakVerb) {
  const map = {
    'helped': 'Try: "Spearheaded", "Facilitated", "Enabled"',
    'assisted': 'Try: "Collaborated", "Supported", "Partnered"',
    'worked on': 'Try: "Developed", "Engineered", "Built"',
    'was responsible for': 'Try: "Managed", "Led", "Directed"',
    'handled': 'Try: "Orchestrated", "Managed", "Executed"',
    'participated in': 'Try: "Contributed to", "Drove", "Championed"',
    'contributed to': 'Try: "Drove", "Delivered", "Spearheaded"',
    'involved in': 'Try: "Led", "Managed", "Executed"',
    'dealt with': 'Try: "Resolved", "Managed", "Addressed"',
    'utilized': 'Try: "Leveraged", "Implemented", "Applied"',
    'used': 'Try: "Leveraged", "Deployed", "Implemented"',
    'did': 'Try: "Executed", "Delivered", "Accomplished"',
    'made': 'Try: "Created", "Designed", "Produced"',
    'got': 'Try: "Secured", "Achieved", "Obtained"',
  };
  return map[weakVerb] || 'Replace with a stronger, quantifiable action verb.';
}

function getRecommendation(score, weakCount, passiveCount) {
  if (score >= 80) return 'Excellent verb usage! Your resume uses strong, impactful language that will resonate with recruiters.';
  if (score >= 60) return `Good foundation, but ${weakCount} weak verbs detected. Replace these with quantifiable action verbs for higher ATS scores.`;
  if (score >= 40) return `Needs improvement. ${weakCount} weak verbs and ${passiveCount} passive constructions found. Rewrite bullet points starting with strong action verbs.`;
  return `Critical: Your resume relies heavily on weak/passive language. Rewrite all bullet points starting with strong action verbs like "Engineered", "Optimized", "Scaled".`;
}

module.exports = { analyzeActionVerbs, STRONG_VERBS, WEAK_VERBS };
