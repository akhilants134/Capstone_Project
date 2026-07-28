/**
 * Layer 3: Database & Storage
 * Connection management with pooling, reconnect strategy, and monitoring
 */

const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  const dbUrl = process.env.DATABASE_URL;

  const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  try {
    const conn = await mongoose.connect(dbUrl, options);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Retrying connection...');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB runtime error:', err);
    });

    return conn;
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
};

module.exports = connectDB;
