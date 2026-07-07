/**
 * Seed 10 employees with departments and designations.
 * Run: node seedEmployees.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Department = require('./models/Department');
const Designation = require('./models/Designation');
const Employee = require('./models/Employee');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI;

// ── Departments ──────────────────────────────────────────────
const departments = [
  { name: 'Engineering',       code: 'ENG',  description: 'Software development and infrastructure' },
  { name: 'Human Resources',   code: 'HR',   description: 'People operations and talent management' },
  { name: 'Finance',           code: 'FIN',  description: 'Financial planning and accounting' },
  { name: 'Marketing',         code: 'MKT',  description: 'Brand, growth and communications' },
  { name: 'Operations',        code: 'OPS',  description: 'Business operations and logistics' },
];

// ── Employees data ───────────────────────────────────────────
const employeesData = [
  {
    fullName: 'Arjun Mehta',
    email: 'arjun.mehta@nexushr.com',
    phone: '+91-9876543210',
    gender: 'male',
    dob: new Date('1992-03-15'),
    bloodGroup: 'O+',
    dept: 'Engineering',
    title: 'Senior Software Engineer',
    level: 3,
    joiningDate: new Date('2021-06-01'),
    employmentType: 'full_time',
    workLocation: 'hybrid',
    salary: 120000,
    skills: ['Node.js', 'React', 'MongoDB', 'Docker'],
  },
  {
    fullName: 'Priya Sharma',
    email: 'priya.sharma@nexushr.com',
    phone: '+91-9876543211',
    gender: 'female',
    dob: new Date('1995-07-22'),
    bloodGroup: 'A+',
    dept: 'Human Resources',
    title: 'HR Manager',
    level: 3,
    joiningDate: new Date('2020-01-15'),
    employmentType: 'full_time',
    workLocation: 'onsite',
    salary: 90000,
    skills: ['Recruitment', 'Employee Relations', 'HRIS'],
  },
  {
    fullName: 'Rahul Verma',
    email: 'rahul.verma@nexushr.com',
    phone: '+91-9876543212',
    gender: 'male',
    dob: new Date('1990-11-08'),
    bloodGroup: 'B+',
    dept: 'Finance',
    title: 'Financial Analyst',
    level: 2,
    joiningDate: new Date('2019-09-01'),
    employmentType: 'full_time',
    workLocation: 'onsite',
    salary: 85000,
    skills: ['Excel', 'Financial Modeling', 'SAP', 'Tableau'],
  },
  {
    fullName: 'Sneha Patel',
    email: 'sneha.patel@nexushr.com',
    phone: '+91-9876543213',
    gender: 'female',
    dob: new Date('1997-02-14'),
    bloodGroup: 'AB+',
    dept: 'Marketing',
    title: 'Marketing Executive',
    level: 1,
    joiningDate: new Date('2022-03-10'),
    employmentType: 'full_time',
    workLocation: 'hybrid',
    salary: 65000,
    skills: ['SEO', 'Content Writing', 'Google Ads', 'Social Media'],
  },
  {
    fullName: 'Kiran Rao',
    email: 'kiran.rao@nexushr.com',
    phone: '+91-9876543214',
    gender: 'male',
    dob: new Date('1988-05-30'),
    bloodGroup: 'O-',
    dept: 'Engineering',
    title: 'Engineering Manager',
    level: 4,
    joiningDate: new Date('2018-11-20'),
    employmentType: 'full_time',
    workLocation: 'onsite',
    salary: 160000,
    skills: ['Team Leadership', 'System Design', 'Agile', 'Python'],
  },
  {
    fullName: 'Ananya Singh',
    email: 'ananya.singh@nexushr.com',
    phone: '+91-9876543215',
    gender: 'female',
    dob: new Date('1994-09-17'),
    bloodGroup: 'A-',
    dept: 'Operations',
    title: 'Operations Analyst',
    level: 2,
    joiningDate: new Date('2021-01-05'),
    employmentType: 'full_time',
    workLocation: 'remote',
    salary: 75000,
    skills: ['Process Improvement', 'Data Analysis', 'JIRA', 'Lean'],
  },
  {
    fullName: 'Vikram Nair',
    email: 'vikram.nair@nexushr.com',
    phone: '+91-9876543216',
    gender: 'male',
    dob: new Date('1993-12-03'),
    bloodGroup: 'B-',
    dept: 'Engineering',
    title: 'DevOps Engineer',
    level: 2,
    joiningDate: new Date('2020-08-15'),
    employmentType: 'full_time',
    workLocation: 'remote',
    salary: 110000,
    skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD'],
  },
  {
    fullName: 'Divya Krishnan',
    email: 'divya.krishnan@nexushr.com',
    phone: '+91-9876543217',
    gender: 'female',
    dob: new Date('1996-04-25'),
    bloodGroup: 'O+',
    dept: 'Finance',
    title: 'Accountant',
    level: 1,
    joiningDate: new Date('2022-07-01'),
    employmentType: 'full_time',
    workLocation: 'onsite',
    salary: 60000,
    skills: ['Tally', 'GST', 'Bookkeeping', 'MS Excel'],
  },
  {
    fullName: 'Rohan Gupta',
    email: 'rohan.gupta@nexushr.com',
    phone: '+91-9876543218',
    gender: 'male',
    dob: new Date('1999-08-11'),
    bloodGroup: 'AB-',
    dept: 'Marketing',
    title: 'UI/UX Designer',
    level: 2,
    joiningDate: new Date('2023-01-15'),
    employmentType: 'full_time',
    workLocation: 'hybrid',
    salary: 72000,
    skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
  },
  {
    fullName: 'Meera Joshi',
    email: 'meera.joshi@nexushr.com',
    phone: '+91-9876543219',
    gender: 'female',
    dob: new Date('1991-06-20'),
    bloodGroup: 'A+',
    dept: 'Operations',
    title: 'Operations Manager',
    level: 4,
    joiningDate: new Date('2017-04-10'),
    employmentType: 'full_time',
    workLocation: 'onsite',
    salary: 140000,
    skills: ['Supply Chain', 'Vendor Management', 'ERP', 'Six Sigma'],
  },
];

// ── Helper: generate employee ID ─────────────────────────────
async function generateEmployeeId() {
  const count = await Employee.countDocuments();
  return `EMP-${String(count + 1).padStart(5, '0')}`;
}

// ── Main seed ────────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`✅ Connected to MongoDB (${mongoose.connection.name})\n`);

    // 1. Upsert departments
    console.log('📁 Seeding departments...');
    const deptMap = {};
    for (const d of departments) {
      const dept = await Department.findOneAndUpdate(
        { code: d.code },
        { $set: d },
        { upsert: true, new: true }
      );
      deptMap[d.name] = dept._id;
      console.log(`   ✔ ${d.name}`);
    }

    // 2. Upsert designations (unique per dept+title)
    console.log('\n🏷️  Seeding designations...');
    const desigMap = {};
    for (const emp of employeesData) {
      const key = `${emp.dept}::${emp.title}`;
      if (desigMap[key]) continue;
      const desig = await Designation.findOneAndUpdate(
        { title: emp.title, department: deptMap[emp.dept] },
        { $set: { title: emp.title, department: deptMap[emp.dept], level: emp.level } },
        { upsert: true, new: true }
      );
      desigMap[key] = desig._id;
      console.log(`   ✔ ${emp.title} (${emp.dept})`);
    }

    // 3. Create employees
    console.log('\n👥 Seeding employees...');
    let created = 0;
    for (const emp of employeesData) {
      const existing = await Employee.findOne({ email: emp.email });
      if (existing) {
        console.log(`   ⚠️  Skipping ${emp.fullName} — already exists`);
        continue;
      }

      const employeeId = await generateEmployeeId();
      await Employee.create({
        employeeId,
        fullName: emp.fullName,
        email: emp.email,
        phone: emp.phone,
        gender: emp.gender,
        dob: emp.dob,
        bloodGroup: emp.bloodGroup,
        department: deptMap[emp.dept],
        designation: desigMap[`${emp.dept}::${emp.title}`],
        joiningDate: emp.joiningDate,
        employmentType: emp.employmentType,
        workLocation: emp.workLocation,
        salary: emp.salary,
        skills: emp.skills,
        status: 'active',
      });
      console.log(`   ✔ ${emp.fullName} (${employeeId})`);
      created++;
    }

    console.log(`\n🎉 Done! Created ${created} employees.`);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected.');
  }
}

seed();
