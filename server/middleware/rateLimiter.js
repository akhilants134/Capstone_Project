/**
 * Layer 9: Rate Limiting
 * In-memory sliding window rate limiter middleware
 */

const requestCounts = new Map();

const createRateLimiter = (options = {}) => {
  const windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes default
  const max = options.max || 100; // 100 requests per window default
  const message = options.message || 'Too many requests, please try again later.';

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();

    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, []);
    }

    const timestamps = requestCounts.get(ip).filter((t) => now - t < windowMs);
    timestamps.push(now);
    requestCounts.set(ip, timestamps);

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - timestamps.length));

    if (timestamps.length > max) {
      return res.status(429).json({ success: false, error: message });
    }

    next();
  };
};

const apiLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 150 });
const authLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 20, message: 'Too many authentication attempts.' });

module.exports = { apiLimiter, authLimiter, createRateLimiter };
