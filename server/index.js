const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// Custom Infrastructure Modules (13 System Layers)
const connectDB = require('./config/db');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const { securityHeaders } = require('./middleware/security');
const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');
const { cacheMiddleware } = require('./middleware/cache');

// Routes
const authRoutes = require('./routes/auth');
const donationRoutes = require('./routes/donations');
const requestRoutes = require('./routes/requests');
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories');
const statsRoutes = require('./routes/stats');
const systemRoutes = require('./routes/system');
const seedRoutes = require('./routes/seed');
const healthRoutes = require('./routes/health');

const app = express();

// Layer 8: Security & Headers
app.use(securityHeaders);
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Layer 12: Request Logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.http(req, res, Date.now() - start);
  });
  next();
});

// Layer 9: Rate Limiting
app.use('/api/', apiLimiter);
app.use('/api/auth', authLimiter);

// Layer 10: Caching
app.use('/api/stats', cacheMiddleware(30));
app.use('/api/categories', cacheMiddleware(300));

// Layer 2: API Endpoints & Routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/seed', seedRoutes);

// Layer 13: Availability & Health Probe
app.use('/api/health', healthRoutes);

// Layer 12: Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Layer 3 & 13: DB Connection & Graceful Shutdown
connectDB()
  .then(() => {
    const server = app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));

    const gracefulShutdown = (signal) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  })
  .catch((err) => {
    logger.error('Failed to initialize application:', err);
    process.exit(1);
  });
