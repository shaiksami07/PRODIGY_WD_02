/**
 * Seed script: creates default roles, a super admin user, and a couple of
 * departments/designations so the app is usable immediately after install.
 * Run with: npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const env = require('../../config/env');
const logger = require('../../utils/logger');

const Role = require('../../models/Role');
const User = require('../../models/User');
const Department = require('../../models/Department');
const Designation = require('../../models/Designation');

const ROLES = [
  { name: 'super_admin', label: 'Super Admin', permissions: ['*'] },
  { name: 'admin', label: 'Admin', permissions: ['employee:*', 'department:*', 'leave:*', 'attendance:*'] },
  { name: 'hr', label: 'HR', permissions: ['employee:*', 'leave:*', 'attendance:read'] },
  { name: 'manager', label: 'Manager', permissions: ['employee:read', 'leave:approve', 'attendance:read'] },
  { name: 'employee', label: 'Employee', permissions: ['employee:read_self', 'leave:create_self'] },
  { name: 'viewer', label: 'Viewer', permissions: ['employee:read'] },
];

async function seed() {
  await mongoose.connect(env.mongoUri);
  logger.info('Seeding database...');

  for (const role of ROLES) {
    await Role.findOneAndUpdate({ name: role.name }, role, { upsert: true, new: true });
  }

  const dept = await Department.findOneAndUpdate(
    { code: 'ENG' },
    { name: 'Engineering', code: 'ENG', description: 'Product & Engineering' },
    { upsert: true, new: true }
  );

  const designation = await Designation.findOneAndUpdate(
    { title: 'Software Engineer', department: dept._id },
    { title: 'Software Engineer', department: dept._id, level: 2 },
    { upsert: true, new: true }
  );

  const existingAdmin = await User.findOne({ email: 'admin@nexushr.com' });
  if (!existingAdmin) {
    await User.create({
      name: 'Super Admin',
      email: 'admin@nexushr.com',
      password: 'ChangeMe123!',
      role: 'super_admin',
      isActive: true,
    });
    logger.info('Created default super admin: admin@nexushr.com / ChangeMe123! (CHANGE THIS PASSWORD)');
  } else {
    logger.info('Super admin already exists, skipping');
  }

  logger.info(`Seed complete. Department: ${dept.name}, Designation: ${designation.title}`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  logger.error('Seeding failed', { error: err.message });
  process.exit(1);
});
