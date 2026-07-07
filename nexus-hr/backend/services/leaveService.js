const Leave = require('../models/Leave');
const { ApiError } = require('../utils/apiResponse');
const auditLogService = require('./auditLogService');
const notificationService = require('./notificationService');

function calcDays(startDate, endDate) {
  const ms = new Date(endDate) - new Date(startDate);
  return Math.max(0.5, Math.round(ms / (1000 * 60 * 60 * 24)) + 1);
}

async function listLeaves({ employee, status, page = 1, limit = 20 } = {}) {
  const filter = { isDeleted: false };
  if (employee) filter.employee = employee;
  if (status) filter.status = status;

  const [items, total] = await Promise.all([
    Leave.find(filter)
      .populate('employee', 'fullName employeeId')
      .populate('approvedBy', 'fullName')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Leave.countDocuments(filter),
  ]);
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}

async function createLeave(employeeId, data, req) {
  const days = calcDays(data.startDate, data.endDate);
  const leave = await Leave.create({ ...data, employee: employeeId, days });
  await auditLogService.record({ action: 'leave.create', resource: 'Leave', resourceId: leave._id, after: leave.toObject(), req });
  return leave;
}

async function reviewLeave(id, { status, reviewNote }, reviewerEmployeeId, req) {
  const leave = await Leave.findById(id);
  if (!leave) throw new ApiError(404, 'Leave request not found');
  if (leave.status !== 'pending') throw new ApiError(400, 'Only pending leave requests can be reviewed');

  leave.status = status;
  leave.reviewNote = reviewNote;
  leave.reviewedAt = new Date();
  leave.approvedBy = reviewerEmployeeId;
  await leave.save();

  await auditLogService.record({ action: `leave.${status}`, resource: 'Leave', resourceId: leave._id, after: leave.toObject(), req });

  return leave;
}

async function cancelLeave(id, employeeId) {
  const leave = await Leave.findOne({ _id: id, employee: employeeId });
  if (!leave) throw new ApiError(404, 'Leave request not found');
  if (leave.status !== 'pending') throw new ApiError(400, 'Only pending requests can be cancelled');
  leave.status = 'cancelled';
  await leave.save();
  return leave;
}

module.exports = { listLeaves, createLeave, reviewLeave, cancelLeave };
