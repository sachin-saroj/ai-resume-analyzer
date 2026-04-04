const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // DEVELOPMENT FALLBACK ALLOWANCE
      req.user = { id: '60d0fe4f5311236168a109ca', subscriptionTier: 'free' };
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    req.user = { id: '60d0fe4f5311236168a109ca', subscriptionTier: 'free' };
    next();
  }
};

module.exports = authMiddleware;
