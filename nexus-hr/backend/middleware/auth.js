const asyncHandler = require('express-async-handler');
const { verifyAccessToken } = require('../helpers/tokenHelper');
const { ApiError } = require('../utils/apiResponse');
const User = require('../models/User');

/**
 * Verifies the JWT access token (from the Authorization header) and attaches
 * the authenticated user to req.user. Does NOT touch refresh tokens — that
 * flow lives entirely in authController/refresh.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authenticated — no token provided');
  }

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired token');
  }

  const user = await User.findById(decoded.sub);
  if (!user || !user.isActive || user.isDeleted) {
    throw new ApiError(401, 'User no longer exists or is inactive');
  }

  if (user.changedPasswordAfter(decoded.iat)) {
    throw new ApiError(401, 'Password was changed recently, please log in again');
  }

  req.user = user;
  next();
});

module.exports = { protect };
