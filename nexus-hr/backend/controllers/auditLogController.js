const asyncHandler = require('express-async-handler');
const AuditLog = require('../models/AuditLog');
const { sendSuccess } = require('../utils/apiResponse');

exports.list = asyncHandler(async (req, res) => {
  const { resource, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (resource) filter.resource = resource;

  const [items, total] = await Promise.all([
    AuditLog.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10)),
    AuditLog.countDocuments(filter),
  ]);

  sendSuccess(res, { message: 'Audit logs fetched', data: { items, total, page: parseInt(page, 10), limit: parseInt(limit, 10) } });
});
