const Redis = require('ioredis');

let redisClient = null;
let isRedisConnected = false;

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

try {
  redisClient = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    retryStrategy: (times) => {
      if (times > 2) return null; // stop retrying quickly in dev
      return Math.min(times * 100, 1000);
    },
    lazyConnect: true
  });

  redisClient.connect().then(() => {
    isRedisConnected = true;
    console.log('✅ Redis connected successfully');
  }).catch((err) => {
    isRedisConnected = false;
    console.warn('⚠️ Redis not running, fallback in-memory cache enabled:', err.message);
  });

  redisClient.on('error', (err) => {
    isRedisConnected = false;
  });
} catch (e) {
  isRedisConnected = false;
}

// In-memory fallback cache
const memoryCache = new Map();

const getCache = async (key) => {
  try {
    if (isRedisConnected && redisClient) {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    }
  } catch (err) {
    // Fall back to memory
  }
  const entry = memoryCache.get(key);
  if (entry && entry.expiry > Date.now()) {
    return entry.value;
  }
  return null;
};

const setCache = async (key, value, ttlSeconds = 60) => {
  try {
    if (isRedisConnected && redisClient) {
      await redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
      return;
    }
  } catch (err) {
    // Fall back to memory
  }
  memoryCache.set(key, {
    value,
    expiry: Date.now() + ttlSeconds * 1000
  });
};

const invalidateCache = async (pattern) => {
  try {
    if (isRedisConnected && redisClient) {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(...keys);
      }
    }
  } catch (err) {}
  
  const cleanPattern = pattern.replace(/\*/g, '');
  for (const key of memoryCache.keys()) {
    if (key.includes(cleanPattern)) {
      memoryCache.delete(key);
    }
  }
};


module.exports = {
  redisClient,
  getCache,
  setCache,
  invalidateCache
};
