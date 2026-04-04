const express = require('express');
const router = express.Router();
const {
  startAnalysis,
  downloadExcel,
  generateCoverLetter,
  getVersionHistory,
  syncLinkedIn,
  getUserPoints
} = require('../controllers/analysisController');
const authMiddleware = require('../middlewares/auth');
const { secureUpload } = require('../middlewares/fileValidator');

// Initiate Analysis Pipeline
router.post('/start', authMiddleware, secureUpload, startAnalysis);

// Download Excel Report
router.get('/:id/export', authMiddleware, downloadExcel);

// Generate Cover Letter
router.get('/:id/cover-letter', authMiddleware, generateCoverLetter);

// Version History
router.get('/history/versions', authMiddleware, getVersionHistory);

// LinkedIn Sync (Mock)
router.get('/linkedin/sync', authMiddleware, syncLinkedIn);

// User Points (Gamification)
router.get('/user/points', authMiddleware, getUserPoints);

module.exports = router;
