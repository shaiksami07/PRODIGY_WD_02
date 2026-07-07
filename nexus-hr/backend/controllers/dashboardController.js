const asyncHandler = require('express-async-handler');
const Employee = require('../models/Employee');
const Department = require('../models/Department');
const Leave = require('../models/Leave');
const attendanceService = require('../services/attendanceService');
const employeeRepository = require('../repositories/employeeRepository');
const { sendSuccess } = require('../utils/apiResponse');

exports.summary = asyncHandler(async (req, res) => {
  const [total, active, inactive, departments, pendingLeave, attendanceRate] = await Promise.all([
    Employee.countDocuments({ isDeleted: false }),
    Employee.countDocuments({ isDeleted: false, status: 'active' }),
    Employee.countDocuments({ isDeleted: false, status: 'inactive' }),
    Department.countDocuments({ isDeleted: false }),
    Leave.countDocuments({ status: 'pending', isDeleted: false }),
    attendanceService.attendanceRate(30),
  ]);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const [newHires, resignations] = await Promise.all([
    Employee.countDocuments({ joiningDate: { $gte: thirtyDaysAgo }, isDeleted: false }),
    Employee.countDocuments({ status: 'resigned', updatedAt: { $gte: thirtyDaysAgo } }),
  ]);

  sendSuccess(res, {
    message: 'Dashboard summary fetched',
    data: {
      totalEmployees: total,
      activeEmployees: active,
      inactiveEmployees: inactive,
      departments,
      pendingLeave,
      monthlyHiring: newHires,
      monthlyResignations: resignations,
      attendanceRate,
    },
  });
});

exports.departmentDistribution = asyncHandler(async (req, res) => {
  const distribution = await Employee.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: '$department', count: { $sum: 1 } } },
    { $lookup: { from: 'departments', localField: '_id', foreignField: '_id', as: 'department' } },
    { $unwind: '$department' },
    { $project: { _id: 0, department: '$department.name', count: 1 } },
  ]);
  sendSuccess(res, { message: 'Department distribution fetched', data: { distribution } });
});

exports.genderDistribution = asyncHandler(async (req, res) => {
  const distribution = await Employee.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: '$gender', count: { $sum: 1 } } },
    { $project: { _id: 0, gender: '$_id', count: 1 } },
  ]);
  sendSuccess(res, { message: 'Gender distribution fetched', data: { distribution } });
});

exports.hiringTrend = asyncHandler(async (req, res) => {
  const trend = await Employee.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: { year: { $year: '$joiningDate' }, month: { $month: '$joiningDate' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 12 },
  ]);
  sendSuccess(res, { message: 'Hiring trend fetched', data: { trend } });
});

exports.upcomingBirthdays = asyncHandler(async (req, res) => {
  const employees = await employeeRepository.upcomingBirthdays(30);
  sendSuccess(res, { message: 'Upcoming birthdays fetched', data: { employees } });
});
