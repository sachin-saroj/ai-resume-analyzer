const User = require('../models/User');

const PRICING = {
  'gpt-4o-mini': {
    input: 0.150 / 1000000,   // $0.150 per 1M tokens
    output: 0.600 / 1000000   // $0.600 per 1M tokens
  },
  'text-embedding-3-small': {
    input: 0.020 / 1000000,   // $0.020 per 1M tokens
  }
};

/**
 * Tracks AI consumption internally per user and returns an estimated cost metric.
 */
const trackUsage = async (userId, modelType, inputTokens, outputTokens = 0) => {
  if (!PRICING[modelType]) return { cost: 0, tokenUsage: 0 };
  
  const cost = (inputTokens * PRICING[modelType].input) + (outputTokens * (PRICING[modelType].output || 0));
  const totalTokens = inputTokens + outputTokens;

  try {
    // Increment the user's monthly token usage
    await User.findByIdAndUpdate(userId, {
      $inc: { monthlyTokenUsage: totalTokens }
    });
  } catch (error) {
    console.error('Failed to track user token usage:', error.message);
    // Don't throw, we don't want a tracking failure to crash the analysis system
  }
  
  return { cost, totalTokens };
};

module.exports = { trackUsage };
