const employeeRepository = require('../repositories/employeeRepository');
const { ApiError } = require('../utils/apiResponse');
const auditLogService = require('./auditLogService');

async function listEmployees(query) {
  return employeeRepository.findMany(query);
}

async function getEmployee(id) {
  const employee = await employeeRepository.findById(id);
  if (!employee) throw new ApiError(404, 'Employee not found');
  return employee;
}

async function createEmployee(data, actorUser, req) {
  const existing = await employeeRepository.findByEmail(data.email);
  if (existing) throw new ApiError(409, 'An employee with this email already exists');

  const employeeId = await employeeRepository.getNextEmployeeId();
  const employee = await employeeRepository.create({ ...data, employeeId });

  await auditLogService.record({
    user: actorUser?._id,
    action: 'employee.create',
    resource: 'Employee',
    resourceId: employee._id,
    after: employee.toObject(),
    req,
  });

  return employee;
}

async function updateEmployee(id, data, actorUser, req) {
  const before = await employeeRepository.findById(id);
  if (!before) throw new ApiError(404, 'Employee not found');

  const updated = await employeeRepository.updateById(id, data);

  await auditLogService.record({
    user: actorUser?._id,
    action: 'employee.update',
    resource: 'Employee',
    resourceId: id,
    before: before.toObject(),
    after: updated.toObject(),
    req,
  });

  return updated;
}

async function deleteEmployee(id, actorUser, req) {
  const employee = await employeeRepository.softDelete(id);
  if (!employee) throw new ApiError(404, 'Employee not found');

  await auditLogService.record({
    user: actorUser?._id,
    action: 'employee.delete',
    resource: 'Employee',
    resourceId: id,
    req,
  });

  return employee;
}

async function restoreEmployee(id, actorUser, req) {
  const employee = await employeeRepository.restore(id);
  if (!employee) throw new ApiError(404, 'Employee not found');

  await auditLogService.record({
    user: actorUser?._id,
    action: 'employee.restore',
    resource: 'Employee',
    resourceId: id,
    req,
  });

  return employee;
}

async function bulkDeleteEmployees(ids, actorUser, req) {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, 'ids must be a non-empty array');
  }
  const result = await employeeRepository.bulkSoftDelete(ids);

  await auditLogService.record({
    user: actorUser?._id,
    action: 'employee.bulk_delete',
    resource: 'Employee',
    resourceId: null,
    after: { ids, count: result.modifiedCount },
    req,
  });

  return result;
}

async function getUpcomingBirthdays(days) {
  return employeeRepository.upcomingBirthdays(days);
}

module.exports = {
  listEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  restoreEmployee,
  bulkDeleteEmployees,
  getUpcomingBirthdays,
};
