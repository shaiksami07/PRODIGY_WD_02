const logger = require('../utils/logger');
const { sendError } = require('../utils/apiResponse');
const env = require('../config/env');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || null;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for field "${err.path}"`;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 422;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => e.message);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = field ? `${field} already exists` : 'Duplicate field value';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token expired';
  }

  if (statusCode >= 500) {
    logger.error(message, { stack: err.stack, path: req.originalUrl });
  } else {
    logger.warn(message, { path: req.originalUrl, statusCode });
  }

  return sendError(res, {
    statusCode,
    message,
    errors: env.isProd && statusCode >= 500 ? null : errors,
  });
}

module.exports = errorHandler;
