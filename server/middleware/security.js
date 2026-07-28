/**
 * Layer 8: Security & RLS (Resource-Level Security)
 * Security headers, sanitization, and data access policies
 */

const securityHeaders = (req, res, next) => {
  // Common security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;"
  );
  next();
};

// Resource Level Security (RLS) check helper
const checkResourceOwnership = (resourceUserIdKey = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    if (req.user.role === 'admin') {
      return next(); // Admin bypass
    }

    const resourceUserId = req.params[resourceUserIdKey] || req.body[resourceUserIdKey];
    if (resourceUserId && resourceUserId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, error: 'Access denied to target resource' });
    }

    next();
  };
};

module.exports = { securityHeaders, checkResourceOwnership };
