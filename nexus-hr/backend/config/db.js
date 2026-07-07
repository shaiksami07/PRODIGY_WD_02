/**
 * MongoDB connection with full Phase 2 configuration:
 * connection events, sensible defaults, and graceful shutdown.
 */
const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../utils/logger');

mongoose.set('strictQuery', true);

async function connectDB() {
  mongoose.connection.on('connected', () => logger.info('Mongoose connected'));
  mongoose.connection.on('error', (err) => logger.error('Mongoose connection error', { error: err.message }));
  mongoose.connection.on('disconnected', () => logger.warn('Mongoose disconnected'));

  try {
    const conn = await mongoose.connect(env.mongoUri, {
      maxPoolSize: 20,
      serverSelectionTimeoutMS: 10000,
    });
    logger.info(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    logger.error('MongoDB connection failed', { error: err.message });
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed due to app termination');
  process.exit(0);
});

module.exports = connectDB;
