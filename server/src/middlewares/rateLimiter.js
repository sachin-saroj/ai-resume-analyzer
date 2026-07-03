const rateLimitStore = {};

// Background task to clean up expired IP records every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const ip in rateLimitStore) {
    if (rateLimitStore[ip].resetTime < now) {
      delete rateLimitStore[ip];
    }
  }
}, 10 * 60 * 1000);

/**
 * Standard, dependency-free in-memory rate limiter middleware.
 */
const rateLimiter = (options = {}) => {
  const windowMs = options.windowMs || 15 * 60 * 1000; // Default: 15 mins
  const max = options.max || 100; // Default: 100 requests per windowMs
  const message = options.message || 'Too many requests from this IP. Please try again later.';

  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const now = Date.now();

    if (!rateLimitStore[ip] || rateLimitStore[ip].resetTime < now) {
      rateLimitStore[ip] = {
        count: 1,
        resetTime: now + windowMs
      };
      return next();
    }

    rateLimitStore[ip].count++;

    if (rateLimitStore[ip].count > max) {
      return res.status(429).json({
        success: false,
        message
      });
    }

    next();
  };
};

module.exports = { rateLimiter };
