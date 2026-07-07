const crypto = require('crypto');
const User = require('../models/User');
const { ApiError } = require('../utils/apiResponse');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
  generateRandomToken,
} = require('../helpers/tokenHelper');
const auditLogService = require('./auditLogService');

function buildTokens(user) {
  const payload = { sub: user._id.toString(), role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  return { accessToken, refreshToken };
}

async function register({ name, email, password }, req) {
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'An account with this email already exists');

  const user = await User.create({ name, email, password, role: 'employee' });
  await auditLogService.record({ user: user._id, action: 'auth.register', resource: 'User', resourceId: user._id, req });

  const tokens = buildTokens(user);
  user.refreshTokenHash = hashToken(tokens.refreshToken);
  await user.save({ validateBeforeSave: false });

  return { user, ...tokens };
}

async function login({ email, password }, req) {
  const user = await User.findOne({ email }).select('+password +refreshTokenHash');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }
  if (!user.isActive || user.isDeleted) {
    throw new ApiError(403, 'This account has been deactivated');
  }

  const tokens = buildTokens(user);
  user.refreshTokenHash = hashToken(tokens.refreshToken);
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  await auditLogService.record({ user: user._id, action: 'auth.login', resource: 'User', resourceId: user._id, req });

  return { user, ...tokens };
}

async function refresh(refreshToken) {
  if (!refreshToken) throw new ApiError(401, 'Refresh token missing');

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.sub).select('+refreshTokenHash');
  if (!user || user.refreshTokenHash !== hashToken(refreshToken)) {
    throw new ApiError(401, 'Refresh token no longer valid');
  }

  const tokens = buildTokens(user);
  user.refreshTokenHash = hashToken(tokens.refreshToken);
  await user.save({ validateBeforeSave: false });

  return { user, ...tokens };
}

async function logout(userId) {
  await User.findByIdAndUpdate(userId, { refreshTokenHash: null });
}

async function forgotPassword(email) {
  const user = await User.findOne({ email });
  if (!user) return null; // do not reveal whether the email exists

  const rawToken = generateRandomToken();
  user.passwordResetToken = hashToken(rawToken);
  user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save({ validateBeforeSave: false });

  return rawToken; // in production this gets emailed, not returned to the client
}

async function resetPassword(rawToken, newPassword) {
  const hashed = hashToken(rawToken);
  const user = await User.findOne({
    passwordResetToken: hashed,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+password');

  if (!user) throw new ApiError(400, 'Reset token is invalid or has expired');

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshTokenHash = undefined;
  await user.save();

  return user;
}

async function changePassword(userId, { currentPassword, newPassword }, req) {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new ApiError(404, 'User not found');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new ApiError(401, 'Current password is incorrect');

  user.password = newPassword;
  await user.save();

  await auditLogService.record({ user: userId, action: 'auth.changePassword', resource: 'User', resourceId: userId, req });
}

module.exports = { register, login, refresh, logout, forgotPassword, resetPassword, changePassword };
