const http = require('http');
const app = require('./app');
const env = require('./config/env');
const logger = require('./utils/logger');
const connectDB = require('./config/db');

const server = http.createServer(app);

connectDB().then(() => {
  server.listen(env.port, () => {
    logger.info(`NexusHR API server running on port ${env.port} [${env.nodeEnv}]`);
  });
});

// Graceful shutdown
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection', { message: err.message, stack: err.stack });
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => process.exit(0));
});

module.exports = server;

