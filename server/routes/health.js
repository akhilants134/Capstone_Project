/**
 * Layer 13: Availability & Recovery
 * Health check & readiness probe route
 */

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  }[dbState] || 'unknown';

  const memoryUsage = process.memoryUsage();
  const healthData = {
    status: dbState === 1 ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    database: {
      status: dbStatus,
    },
    system: {
      memoryRssMB: (memoryUsage.rss / 1024 / 1024).toFixed(2),
      heapTotalMB: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2),
      heapUsedMB: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2),
    },
  };

  const statusCode = dbState === 1 ? 200 : 503;
  res.status(statusCode).json(healthData);
});

module.exports = router;
