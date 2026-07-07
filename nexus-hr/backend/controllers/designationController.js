const asyncHandler = require('express-async-handler');
const Designation = require('../models/Designation');
const { sendSuccess } = require('../utils/apiResponse');

exports.list = asyncHandler(async (req, res) => {
  const filter = { isDeleted: false };
  if (req.query.department) filter.department = req.query.department;
  const designations = await Designation.find(filter).populate('department', 'name').sort({ level: -1 });
  sendSuccess(res, { message: 'Designations fetched', data: { designations } });
});

exports.create = asyncHandler(async (req, res) => {
  const designation = await Designation.create(req.body);
  sendSuccess(res, { statusCode: 201, message: 'Designation created', data: { designation } });
});
