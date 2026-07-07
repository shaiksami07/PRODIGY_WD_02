const asyncHandler = require('express-async-handler');
const attendanceService = require('../services/attendanceService');
const { sendSuccess } = require('../utils/apiResponse');

exports.checkIn = asyncHandler(async (req, res) => {
  const record = await attendanceService.checkIn(req.body.employee);
  sendSuccess(res, { message: 'Checked in', data: { record } });
});

exports.checkOut = asyncHandler(async (req, res) => {
  const record = await attendanceService.checkOut(req.body.employee);
  sendSuccess(res, { message: 'Checked out', data: { record } });
});

exports.list = asyncHandler(async (req, res) => {
  const { employee, from, to, page, limit } = req.query;
  const result = await attendanceService.listAttendance({
    employee, from, to,
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? parseInt(limit, 10) : 31,
  });
  sendSuccess(res, { message: 'Attendance fetched', data: result });
});
