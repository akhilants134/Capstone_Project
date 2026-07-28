/**
 * Layer 10: Caching & CDN
 * In-Memory Response Caching & CDN HTTP Cache Control Headers
 */

const cacheStore = new Map();

const cacheMiddleware = (durationSeconds = 60) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = req.originalUrl || req.url;
    const cached = cacheStore.get(key);
    const now = Date.now();

    if (cached && now < cached.expiry) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Cache-Control', `public, max-age=${durationSeconds}`);
      return res.json(cached.body);
    }

    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cacheStore.set(key, {
          body,
          expiry: Date.now() + durationSeconds * 1000,
        });
      }
      res.setHeader('X-Cache', 'MISS');
      res.setHeader('Cache-Control', `public, max-age=${durationSeconds}`);
      return originalJson(body);
    };

    next();
  };
};

const clearCache = () => {
  cacheStore.clear();
};

module.exports = { cacheMiddleware, clearCache };
