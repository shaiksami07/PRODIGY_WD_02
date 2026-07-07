const asyncHandler = require('express-async-handler');
const departmentService = require('../services/departmentService');
const { sendSuccess } = require('../utils/apiResponse');

exports.list = asyncHandler(async (req, res) => {
  const departments = await departmentService.listDepartments();
  sendSuccess(res, { message: 'Departments fetched', data: { departments } });
});

exports.getOne = asyncHandler(async (req, res) => {
  const department = await departmentService.getDepartment(req.params.id);
  sendSuccess(res, { message: 'Department fetched', data: { department } });
});

exports.create = asyncHandler(async (req, res) => {
  const department = await departmentService.createDepartment(req.body, req.user, req);
  sendSuccess(res, { statusCode: 201, message: 'Department created', data: { department } });
});

exports.update = asyncHandler(async (req, res) => {
  const department = await departmentService.updateDepartment(req.params.id, req.body, req.user, req);
  sendSuccess(res, { message: 'Department updated', data: { department } });
});

exports.remove = asyncHandler(async (req, res) => {
  await departmentService.deleteDepartment(req.params.id, req.user, req);
  sendSuccess(res, { message: 'Department deleted' });
});
