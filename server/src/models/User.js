const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false, // Don't return password in queries by default
  },
  subscriptionTier: {
    type: String,
    enum: ['free', 'pro', 'elite'],
    default: 'free',
  },
  monthlyTokenUsage: {
    type: Number,
    default: 0,
  },
  rateLimitTracker: {
    lastReset: {
      type: Date,
      default: Date.now,
    },
    analysesThisMonth: {
      type: Number,
      default: 0,
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
