const asyncHandler = require('express-async-handler');
const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');
const { sendSuccess } = require('../utils/apiResponse');
const { ApiError } = require('../utils/apiResponse');

exports.generatePreview = asyncHandler(async (req, res) => {
  const { month, year } = req.body;
  const employees = await Employee.find({ isDeleted: false, status: 'active' });

  const previews = await Promise.all(
    employees.map(async (emp) => {
      const basic = emp.salary;
      const allowances = Math.round(basic * 0.1);
      const deductions = Math.round(basic * 0.05);
      const netPay = basic + allowances - deductions;

      return Payroll.findOneAndUpdate(
        { employee: emp._id, month, year },
        { employee: emp._id, month, year, basic, allowances, deductions, netPay, status: 'preview' },
        { upsert: true, new: true }
      );
    })
  );

  sendSuccess(res, { message: 'Payroll preview generated', data: { previews } });
});

exports.list = asyncHandler(async (req, res) => {
  const { month, year, employee } = req.query;
  const filter = {};
  if (month) filter.month = parseInt(month, 10);
  if (year) filter.year = parseInt(year, 10);
  if (employee) filter.employee = employee;

  const items = await Payroll.find(filter).populate('employee', 'fullName employeeId').sort({ createdAt: -1 });
  sendSuccess(res, { message: 'Payroll records fetched', data: { items } });
});
