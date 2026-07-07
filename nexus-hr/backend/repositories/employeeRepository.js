const Employee = require('../models/Employee');

function buildFilter({ search, department, designation, status, employmentType } = {}) {
  const filter = { isDeleted: false };
  if (search) filter.$text = { $search: search };
  if (department) filter.department = department;
  if (designation) filter.designation = designation;
  if (status) filter.status = status;
  if (employmentType) filter.employmentType = employmentType;
  return filter;
}

async function findMany({ search, department, designation, status, employmentType, page = 1, limit = 20, sortBy = 'createdAt', sortDir = -1 }) {
  const filter = buildFilter({ search, department, designation, status, employmentType });
  const [items, total] = await Promise.all([
    Employee.find(filter)
      .populate('department', 'name code')
      .populate('designation', 'title')
      .populate('manager', 'fullName employeeId')
      .sort({ [sortBy]: sortDir })
      .skip((page - 1) * limit)
      .limit(limit),
    Employee.countDocuments(filter),
  ]);
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}

async function findById(id) {
  return Employee.findOne({ _id: id, isDeleted: false })
    .populate('department', 'name code')
    .populate('designation', 'title')
    .populate('manager', 'fullName employeeId');
}

async function findByEmail(email) {
  return Employee.findOne({ email, isDeleted: false });
}

async function create(data) {
  return Employee.create(data);
}

async function updateById(id, data) {
  return Employee.findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true, runValidators: true });
}

async function softDelete(id) {
  return Employee.findOneAndUpdate({ _id: id }, { isDeleted: true, deletedAt: new Date(), status: 'inactive' }, { new: true });
}

async function restore(id) {
  return Employee.findOneAndUpdate({ _id: id }, { isDeleted: false, deletedAt: null, status: 'active' }, { new: true });
}

async function bulkSoftDelete(ids) {
  return Employee.updateMany({ _id: { $in: ids } }, { isDeleted: true, deletedAt: new Date(), status: 'inactive' });
}

async function getNextEmployeeId() {
  const count = await Employee.countDocuments({});
  return `EMP-${String(count + 1).padStart(5, '0')}`;
}

async function upcomingBirthdays(days = 30) {
  // Simple aggregation comparing month/day regardless of year
  const now = new Date();
  return Employee.aggregate([
    { $match: { isDeleted: false, dob: { $exists: true, $ne: null } } },
    {
      $addFields: {
        dobMonthDay: { $dateToString: { format: '%m-%d', date: '$dob' } },
      },
    },
    { $limit: 500 },
  ]).then((docs) =>
    docs.filter((d) => {
      const [m, day] = d.dobMonthDay.split('-').map(Number);
      const next = new Date(now.getFullYear(), m - 1, day);
      if (next < now) next.setFullYear(now.getFullYear() + 1);
      const diffDays = (next - now) / (1000 * 60 * 60 * 24);
      return diffDays <= days;
    })
  );
}

module.exports = {
  findMany,
  findById,
  findByEmail,
  create,
  updateById,
  softDelete,
  restore,
  bulkSoftDelete,
  getNextEmployeeId,
  upcomingBirthdays,
};
