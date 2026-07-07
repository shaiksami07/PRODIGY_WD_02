const Department = require('../models/Department');

async function findMany() {
  return Department.find({ isDeleted: false }).populate('head', 'fullName employeeId').sort({ name: 1 });
}

async function findById(id) {
  return Department.findOne({ _id: id, isDeleted: false }).populate('head', 'fullName employeeId');
}

async function findByCode(code) {
  return Department.findOne({ code: code.toUpperCase(), isDeleted: false });
}

async function create(data) {
  return Department.create(data);
}

async function updateById(id, data) {
  return Department.findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true, runValidators: true });
}

async function softDelete(id) {
  return Department.findOneAndUpdate({ _id: id }, { isDeleted: true, isActive: false }, { new: true });
}

module.exports = { findMany, findById, findByCode, create, updateById, softDelete };
