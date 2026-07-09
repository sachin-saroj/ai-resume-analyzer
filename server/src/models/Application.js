const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  company: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    trim: true,
  },
  analysisId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Analysis',
    required: false,
  },
  status: {
    type: String,
    enum: ['applied', 'interviewing', 'offer', 'rejected'],
    default: 'applied',
  },
  appliedDate: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    default: '',
  },
  followUpDate: {
    type: Date,
    required: false,
  }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
