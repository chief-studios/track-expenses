const { logError, logWarn, logInfo } = require('../utils/logger');

// Environment variable validation
const validateEnv = () => {
  const requiredVars = {
    MONGO_URI: 'MongoDB connection string',
    JWT_SECRET: 'JWT secret key',
  };

  const optionalVars = {
    PORT: { default: 5000, description: 'Server port' },
    NODE_ENV: { default: 'development', description: 'Environment' },
    LOG_LEVEL: { default: 'info', description: 'Logging level' },
  };

  const errors = [];
  const warnings = [];

  // Check required variables
  for (const [varName, description] of Object.entries(requiredVars)) {
    if (!process.env[varName]) {
      errors.push(`${varName} is required (${description})`);
    }
  }

  // Set defaults for optional variables
  for (const [varName, config] of Object.entries(optionalVars)) {
    if (!process.env[varName]) {
      process.env[varName] = config.default.toString();
      warnings.push(`${varName} not set, using default: ${config.default} (${config.description})`);
    }
  }

  // Validate specific formats
  if (process.env.MONGO_URI && !process.env.MONGO_URI.startsWith('mongodb')) {
    errors.push('MONGO_URI must be a valid MongoDB connection string');
  }

  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    warnings.push('JWT_SECRET should be at least 32 characters long for security');
  }

  if (process.env.PORT && isNaN(parseInt(process.env.PORT))) {
    errors.push('PORT must be a valid number');
  }

  // Log results
  if (warnings.length > 0) {
    warnings.forEach(warning => logWarn('Environment Warning', { warning }));
  }

  if (errors.length > 0) {
    errors.forEach(error => logError('Environment Error', null, { error }));
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
  }

  logInfo('Environment validation passed', {
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    logLevel: process.env.LOG_LEVEL
  });
};

// Get configuration object
const getConfig = () => {
  return {
    port: parseInt(process.env.PORT),
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV,
    logLevel: process.env.LOG_LEVEL,
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
  };
};

module.exports = {
  validateEnv,
  getConfig
};
