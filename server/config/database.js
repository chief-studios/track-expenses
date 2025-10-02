const mongoose = require('mongoose');
const { logInfo, logError } = require('../utils/logger');

// Database indexes configuration
const createIndexes = async () => {
  try {
    // User indexes
    await mongoose.model('User').collection.createIndex(
      { email: 1 }, 
      { unique: true, background: true }
    );
    await mongoose.model('User').collection.createIndex(
      { username: 1 }, 
      { unique: true, background: true }
    );

    // Bill indexes
    await mongoose.model('bill').collection.createIndex(
      { createdBy: 1 },
      { background: true }
    );
    await mongoose.model('bill').collection.createIndex(
      { createdAt: -1 },
      { background: true }
    );

    // Expense indexes
    await mongoose.model('expense').collection.createIndex(
      { bill: 1 },
      { background: true }
    );
    await mongoose.model('expense').collection.createIndex(
      { submittedBy: 1 },
      { background: true }
    );
    await mongoose.model('expense').collection.createIndex(
      { category: 1 },
      { background: true }
    );
    await mongoose.model('expense').collection.createIndex(
      { date: -1 },
      { background: true }
    );

    logInfo('Database indexes created successfully');
  } catch (error) {
    logError('Failed to create database indexes', error);
  }
};

// Database connection with retry logic
const connectDB = async () => {
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        family: 4 // Use IPv4, skip trying IPv6
      });

      logInfo('Connected to MongoDB successfully', {
        host: conn.connection.host,
        port: conn.connection.port,
        database: conn.connection.name
      });

      // Create indexes after successful connection
      await createIndexes();

      return conn;
    } catch (error) {
      retries++;
      logError(`MongoDB connection attempt ${retries} failed`, error);
      
      if (retries === maxRetries) {
        logError('All MongoDB connection attempts failed');
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      const delay = Math.pow(2, retries) * 1000;
      logInfo(`Retrying connection in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Graceful shutdown
const gracefulShutdown = () => {
  mongoose.connection.close(() => {
    logInfo('MongoDB connection closed through app termination');
    process.exit(0);
  });
};

// Connection event listeners
mongoose.connection.on('connected', () => {
  logInfo('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  logError('Mongoose connection error', err);
});

mongoose.connection.on('disconnected', () => {
  logInfo('Mongoose disconnected from MongoDB');
});

// Handle process termination
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

module.exports = {
  connectDB,
  createIndexes,
  gracefulShutdown
};
