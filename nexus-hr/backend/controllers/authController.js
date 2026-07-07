const asyncHandler = require('express-async-handler');
const authService = require('../services/authService');
const { sendSuccess } = require('../utils/apiResponse');
const env = require('../config/env');

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.isProd,
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/api/auth',
};

function sanitizeUser(user) {
  const obj = user.toObject ? user.toObject() : user;
  delete obj.password;
  delete obj.refreshTokenHash;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  return obj;
}

exports.register = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.register(req.body, req);
  res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
  sendSuccess(res, {
    statusCode: 201,
    message: 'Account created successfully',
    data: { user: sanitizeUser(user), accessToken },
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body, req);
  res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
  sendSuccess(res, {
    message: 'Logged in successfully',
    data: { user: sanitizeUser(user), accessToken },
  });
});

exports.refresh = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  const { user, accessToken, refreshToken } = await authService.refresh(token);
  res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
  sendSuccess(res, { message: 'Token refreshed', data: { user: sanitizeUser(user), accessToken } });
});

exports.logout = asyncHandler(async (req, res) => {
  if (req.user) await authService.logout(req.user._id);
  res.clearCookie('refreshToken', { path: '/api/auth' });
  sendSuccess(res, { message: 'Logged out successfully' });
});

exports.me = asyncHandler(async (req, res) => {
  sendSuccess(res, { message: 'Current user', data: { user: sanitizeUser(req.user) } });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const rawToken = await authService.forgotPassword(req.body.email);
  // In production this token is emailed to the user, never returned in the API response.
  sendSuccess(res, {
    message: 'If that email exists, a password reset link has been sent',
    data: env.isProd ? null : { devOnlyResetToken: rawToken },
  });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body.token, req.body.password);
  sendSuccess(res, { message: 'Password has been reset successfully' });
});

exports.changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user._id, req.body, req);
  sendSuccess(res, { message: 'Password changed successfully' });
});
