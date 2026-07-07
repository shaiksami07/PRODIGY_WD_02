/**
 * Standardized API response helpers.
 * Every endpoint in NexusHR must respond using this shape:
 * { success, message, data, errors }
 */

function sendSuccess(res, { statusCode = 200, message = 'Success', data = null } = {}) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    errors: null,
  });
}

function sendError(res, { statusCode = 500, message = 'Something went wrong', errors = null } = {}) {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
    errors,
  });
}

class ApiError extends Error {
  constructor(statusCode, message, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { sendSuccess, sendError, ApiError };
