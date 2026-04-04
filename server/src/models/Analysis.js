const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  resumeVersion: {
    type: Number,
    default: 1
  },
  resumeUrl: {
    type: String,
    required: false
  },
  rawResumeText: {
    type: String,
    required: false
  },
  jobDescriptionText: {
    type: String,
    required: true
  },
  scores: {
    overallScore: { type: Number, default: 0 },
    atsScore: { type: Number, default: 0 },
    confidenceScore: { type: Number, default: 100 },
    breakdown: {
      skills: { type: Number, default: 0 },
      experience: { type: Number, default: 0 },
      projects: { type: Number, default: 0 },
      formatting: { type: Number, default: 0 }
    },
    radar: [{
      subject: String,
      A: Number,
      fullMark: { type: Number, default: 100 }
    }]
  },
  benchmarking: {
    percentile: { type: Number, default: 50 },
    category: { type: String, enum: ['Top 10%', 'Top 25%', 'Average', 'Below Average'], default: 'Average' },
    explanation: { type: String }
  },
  ontologyData: {
    resumeCategories: { type: Object, default: {} },
    jdCategories: { type: Object, default: {} },
    categoryScores: { type: Object, default: {} }
  },
  careerPath: {
    recommendedRoles: [{ type: String }],
    reasoning: [{ type: String }]
  },
  extractedData: {
    resume: {
      personalInfo: {
        name: String,
        email: String,
        phone: String
      },
      skills: [{ type: String }],
      experienceRoles: [{
        title: String,
        company: String,
        duration: String,
        description: String,
        technologies: [String]
      }],
      education: [{
        degree: String,
        institution: String,
        year: String
      }],
      projects: [{
        name: String,
        description: String,
        technologies: [String]
      }]
    }
  },
  suggestions: {
    missingSkills: [{ type: String }],
    reasoning: [{ type: String }]
  },
  insights: {
    topIssues: [{ type: String }],
    quickWins: [{ type: String }],
    priorityInsights: [{
      issue: String,
      impact: { type: String, enum: ['high', 'medium', 'low'] },
      fix: String
    }]
  },
  marketInsights: {
    salaryPrediction: {
      min: String,
      max: String,
      median: String,
      currency: String,
      confidence: String,
      band: String,
      dominantSkillArea: String,
      multiplierApplied: Number
    },
    interviewQuestions: [{
      q: String,
      type: String
    }]
  },
  verbAnalysis: {
    verbScore: Number,
    overallGrade: String,
    recommendation: String,
    stats: {
      totalSentences: Number,
      strongVerbCount: Number,
      weakVerbCount: Number,
      passiveVoiceCount: Number
    },
    strongVerbs: [{ type: Object }],
    weakVerbs: [{ type: Object }],
    passiveVoice: [{ type: Object }],
    annotations: [{ type: Object }]
  },
  versionComparison: {
    scoreChange: { type: Number, default: 0 },
    skillsAdded: [{ type: String }],
    skillsRemoved: [{ type: String }]
  },
  aiTracking: {
    tokenUsage: { type: Number, default: 0 },
    apiCostEstimate: { type: Number, default: 0 },
    cachingUsed: { type: Boolean, default: false }
  }
}, { timestamps: true });

module.exports = mongoose.model('Analysis', analysisSchema);
