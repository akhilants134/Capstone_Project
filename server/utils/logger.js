/**
 * Layer 12: Error Tracking & Logs
 * Structured Logging System
 */

const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const errorLogPath = path.join(logDir, 'error.log');
const combinedLogPath = path.join(logDir, 'combined.log');

const formatMessage = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const metaString = Object.keys(meta).length ? JSON.stringify(meta) : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message} ${metaString}\n`;
};

const logger = {
  info: (message, meta = {}) => {
    const log = formatMessage('info', message, meta);
    console.log(log.trim());
    fs.appendFileSync(combinedLogPath, log);
  },
  warn: (message, meta = {}) => {
    const log = formatMessage('warn', message, meta);
    console.warn(log.trim());
    fs.appendFileSync(combinedLogPath, log);
  },
  error: (message, meta = {}) => {
    const log = formatMessage('error', message, meta);
    console.error(log.trim());
    fs.appendFileSync(combinedLogPath, log);
    fs.appendFileSync(errorLogPath, log);
  },
  http: (req, res, responseTime) => {
    const log = formatMessage('http', `${req.method} ${req.originalUrl} ${res.statusCode}`, {
      ip: req.ip,
      responseTime: `${responseTime}ms`,
    });
    fs.appendFileSync(combinedLogPath, log);
  }
};

module.exports = logger;
