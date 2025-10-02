const winston = require('winston');
const path = require('path');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'expense-tracker-api' },
  transports: [
    // Write to all logs with level 'info' and below to 'combined.log'
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/error.log'), 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// If we're not in production, log to the console as well
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        return `${timestamp} [${level}]: ${message} ${
          Object.keys(meta).length > 0 ? JSON.stringify(meta, null, 2) : ''
        }`;
      })
    )
  }));
}

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Helper functions for different log levels
const logInfo = (message, meta = {}) => {
  logger.info(message, meta);
};

const logError = (message, error = null, meta = {}) => {
  const errorMeta = error ? { 
    error: error.message, 
    stack: error.stack,
    ...meta 
  } : meta;
  logger.error(message, errorMeta);
};

const logWarn = (message, meta = {}) => {
  logger.warn(message, meta);
};

const logDebug = (message, meta = {}) => {
  logger.debug(message, meta);
};

// HTTP request logger middleware
const httpLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
    };
    
    if (res.statusCode >= 400) {
      logError(`HTTP ${req.method} ${req.originalUrl}`, null, logData);
    } else {
      logInfo(`HTTP ${req.method} ${req.originalUrl}`, logData);
    }
  });
  
  next();
};

module.exports = {
  logger,
  logInfo,
  logError,
  logWarn,
  logDebug,
  httpLogger
};
