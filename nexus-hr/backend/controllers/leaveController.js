const asyncHandler = require('express-async-handler');
const leaveService = require('../services/leaveService');
const { sendSuccess } = require('../utils/apiResponse');

exports.list = asyncHandler(async (req, res) => {
  const { employee, status, page, limit } = req.query;
  const result = await leaveService.listLeaves({
    employee,
    status,
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? parseInt(limit, 10) : 20,
  });
  sendSuccess(res, { message: 'Leave requests fetched', data: result });
});

exports.create = asyncHandler(async (req, res) => {
  const leave = await leaveService.createLeave(req.body.employee, req.body, req);
  sendSuccess(res, { statusCode: 201, message: 'Leave request submitted', data: { leave } });
});

exports.review = asyncHandler(async (req, res) => {
  const leave = await leaveService.reviewLeave(req.params.id, req.body, req.body.reviewerEmployeeId, req);
  sendSuccess(res, { message: `Leave request ${leave.status}`, data: { leave } });
});

exports.cancel = asyncHandler(async (req, res) => {
  const leave = await leaveService.cancelLeave(req.params.id, req.body.employee);
  sendSuccess(res, { message: 'Leave request cancelled', data: { leave } });
});
