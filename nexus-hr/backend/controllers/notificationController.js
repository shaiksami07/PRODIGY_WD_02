const asyncHandler = require('express-async-handler');
const notificationService = require('../services/notificationService');
const { sendSuccess } = require('../utils/apiResponse');

exports.list = asyncHandler(async (req, res) => {
  const { unreadOnly, page, limit } = req.query;
  const result = await notificationService.listForUser(req.user._id, {
    unreadOnly: unreadOnly === 'true',
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? parseInt(limit, 10) : 20,
  });
  sendSuccess(res, { message: 'Notifications fetched', data: result });
});

exports.markRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markRead(req.params.id, req.user._id);
  sendSuccess(res, { message: 'Notification marked as read', data: { notification } });
});

exports.markAllRead = asyncHandler(async (req, res) => {
  await notificationService.markAllRead(req.user._id);
  sendSuccess(res, { message: 'All notifications marked as read' });
});
