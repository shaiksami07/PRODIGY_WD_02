const departmentRepository = require('../repositories/departmentRepository');
const Employee = require('../models/Employee');
const { ApiError } = require('../utils/apiResponse');
const auditLogService = require('./auditLogService');

async function listDepartments() {
  return departmentRepository.findMany();
}

async function getDepartment(id) {
  const dept = await departmentRepository.findById(id);
  if (!dept) throw new ApiError(404, 'Department not found');
  return dept;
}

async function createDepartment(data, actorUser, req) {
  const existing = await departmentRepository.findByCode(data.code);
  if (existing) throw new ApiError(409, 'A department with this code already exists');

  const dept = await departmentRepository.create(data);
  await auditLogService.record({ user: actorUser?._id, action: 'department.create', resource: 'Department', resourceId: dept._id, after: dept.toObject(), req });
  return dept;
}

async function updateDepartment(id, data, actorUser, req) {
  const dept = await departmentRepository.updateById(id, data);
  if (!dept) throw new ApiError(404, 'Department not found');
  await auditLogService.record({ user: actorUser?._id, action: 'department.update', resource: 'Department', resourceId: id, after: dept.toObject(), req });
  return dept;
}

async function deleteDepartment(id, actorUser, req) {
  const activeCount = await Employee.countDocuments({ department: id, isDeleted: false, status: 'active' });
  if (activeCount > 0) {
    throw new ApiError(400, `Cannot delete department with ${activeCount} active employee(s). Reassign them first.`);
  }
  const dept = await departmentRepository.softDelete(id);
  if (!dept) throw new ApiError(404, 'Department not found');
  await auditLogService.record({ user: actorUser?._id, action: 'department.delete', resource: 'Department', resourceId: id, req });
  return dept;
}

module.exports = { listDepartments, getDepartment, createDepartment, updateDepartment, deleteDepartment };
