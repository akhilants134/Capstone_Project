const express = require('express');
const mongoose = require('mongoose');
const { protect, adminOnly } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.use(apiLimiter);

router.get('/status', protect, adminOnly, async (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = { 0: 'Disconnected', 1: 'Operational', 2: 'Connecting', 3: 'Disconnecting' };

  res.json({
    database: dbStatusMap[dbState] || 'Unknown',
    matchingEngine: 'Running',
    notifications: 'Active',
    storage: 'Connected',
  });
});

router.post('/reset', protect, adminOnly, async (req, res) => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
    const seedModule = require('./seed');
    res.json({ message: 'System reset complete. Please re-seed the data.' });
  } catch (err) {
    res.status(500).json({ message: 'Reset failed' });
  }
});

module.exports = router;
