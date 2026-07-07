const { validationResult } = require('express-validator');
const { ApiError } = require('../utils/apiResponse');

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(422, 'Validation failed', errors.array().map((e) => e.msg)));
  }
  next();
}

module.exports = handleValidation;
