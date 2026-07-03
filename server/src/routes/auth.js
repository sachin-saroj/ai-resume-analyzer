const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const authMiddleware = require('../middlewares/auth');
const { rateLimiter } = require('../middlewares/rateLimiter');

const authLimiter = rateLimiter({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 15,
  message: 'Too many authentication attempts from this IP. Please try again after 10 minutes.'
});

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.get('/me', authMiddleware, getMe);

module.exports = router;
