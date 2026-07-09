const express = require('express');
const router = express.Router();
const {
  startAnalysis,
  downloadExcel,
  generateCoverLetter,
  getVersionHistory,
  syncLinkedIn,
  getUserPoints,
  rescoreAnalysis,
  getAnalyticsSummary
} = require('../controllers/analysisController');
const authMiddleware = require('../middlewares/auth');
const { secureUpload } = require('../middlewares/fileValidator');

const { rateLimiter } = require('../middlewares/rateLimiter');

const analysisLimiter = rateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30,
  message: 'Too many analysis requests from this IP. Please try again after 5 minutes.'
});

// Initiate Analysis Pipeline
router.post('/start', authMiddleware, analysisLimiter, secureUpload, startAnalysis);

// Download Excel Report
router.get('/:id/export', authMiddleware, downloadExcel);

// Generate Cover Letter
router.get('/:id/cover-letter', authMiddleware, generateCoverLetter);

// Rescore (Apply Live Patch)
router.post('/:id/rescore', authMiddleware, analysisLimiter, rescoreAnalysis);

// Version History
router.get('/history/versions', authMiddleware, getVersionHistory);

// Analytics Summary
router.get('/analytics/summary', authMiddleware, getAnalyticsSummary);
router.get('/summary', authMiddleware, getAnalyticsSummary);

// LinkedIn Sync (Mock)
router.get('/linkedin/sync', authMiddleware, syncLinkedIn);

// User Points (Gamification)
router.get('/user/points', authMiddleware, getUserPoints);

module.exports = router;
