const asyncHandler = require('express-async-handler');
const employeeService = require('../services/employeeService');
const { sendSuccess } = require('../utils/apiResponse');

exports.list = asyncHandler(async (req, res) => {
  const { search, department, designation, status, employmentType, page, limit, sortBy, sortDir } = req.query;
  const result = await employeeService.listEmployees({
    search,
    department,
    designation,
    status,
    employmentType,
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? parseInt(limit, 10) : 20,
    sortBy,
    sortDir: sortDir === 'asc' ? 1 : -1,
  });
  sendSuccess(res, { message: 'Employees fetched', data: result });
});

exports.getOne = asyncHandler(async (req, res) => {
  const employee = await employeeService.getEmployee(req.params.id);
  sendSuccess(res, { message: 'Employee fetched', data: { employee } });
});

exports.create = asyncHandler(async (req, res) => {
  const employee = await employeeService.createEmployee(req.body, req.user, req);
  sendSuccess(res, { statusCode: 201, message: 'Employee created', data: { employee } });
});

exports.update = asyncHandler(async (req, res) => {
  const employee = await employeeService.updateEmployee(req.params.id, req.body, req.user, req);
  sendSuccess(res, { message: 'Employee updated', data: { employee } });
});

exports.remove = asyncHandler(async (req, res) => {
  await employeeService.deleteEmployee(req.params.id, req.user, req);
  sendSuccess(res, { message: 'Employee deleted' });
});

exports.restore = asyncHandler(async (req, res) => {
  const employee = await employeeService.restoreEmployee(req.params.id, req.user, req);
  sendSuccess(res, { message: 'Employee restored', data: { employee } });
});

exports.bulkDelete = asyncHandler(async (req, res) => {
  const result = await employeeService.bulkDeleteEmployees(req.body.ids, req.user, req);
  sendSuccess(res, { message: `${result.modifiedCount} employees deleted` });
});

exports.upcomingBirthdays = asyncHandler(async (req, res) => {
  const days = req.query.days ? parseInt(req.query.days, 10) : 30;
  const employees = await employeeService.getUpcomingBirthdays(days);
  sendSuccess(res, { message: 'Upcoming birthdays fetched', data: { employees } });
});
