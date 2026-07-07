/**
 * Seed leaves, payrolls, and attendance for all employees.
 * Run: node seedHRData.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Employee = require('./models/Employee');
const Leave = require('./models/Leave');
const Payroll = require('./models/Payroll');
const Attendance = require('./models/Attendance');

const MONGO_URI = process.env.MONGO_URI;

// ── Helpers ───────────────────────────────────────────────────
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
// Returns array of working-day dates (Mon–Fri) in a given month/year
function getWorkingDays(year, month) {
  const days = [];
  const d = new Date(year, month - 1, 1);
  while (d.getMonth() === month - 1) {
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

// ── Leave seed ────────────────────────────────────────────────
const leaveTypes = ['sick', 'casual', 'earned', 'unpaid'];
const leaveStatuses = ['approved', 'approved', 'approved', 'rejected', 'pending'];
const leaveReasons = [
  'Feeling unwell and need to rest',
  'Personal family matter',
  'Medical appointment',
  'Out of town for a family event',
  'Annual vacation',
  "Child's school event",
  'Home maintenance emergency',
  'Mental health day',
];

async function seedLeaves(employees) {
  console.log('\n🏖️  Seeding leaves...');
  let count = 0;
  for (const emp of employees) {
    // 2–4 leave records per employee over the past 6 months
    const numLeaves = randomInt(2, 4);
    for (let i = 0; i < numLeaves; i++) {
      const daysAgo = randomInt(10, 180);
      const startDate = addDays(new Date(), -daysAgo);
      const leaveDays = randomInt(1, 3);
      const endDate = addDays(startDate, leaveDays - 1);
      const status = randomItem(leaveStatuses);

      await Leave.create({
        employee: emp._id,
        type: randomItem(leaveTypes),
        startDate,
        endDate,
        days: leaveDays,
        reason: randomItem(leaveReasons),
        status,
        approvedBy: status === 'approved' ? emp._id : undefined,
        reviewedAt: status !== 'pending' ? addDays(startDate, -1) : undefined,
        reviewNote: status === 'rejected' ? 'Insufficient leave balance' : undefined,
      });
      count++;
    }
    console.log(`   ✔ ${emp.fullName} — ${numLeaves} leave records`);
  }
  console.log(`   Total: ${count} leave records created`);
}

// ── Payroll seed ──────────────────────────────────────────────
async function seedPayroll(employees) {
  console.log('\n💰 Seeding payroll...');
  let count = 0;
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // 1-based

  for (const emp of employees) {
    // Last 6 months of payroll
    for (let i = 5; i >= 0; i--) {
      let month = currentMonth - i;
      let year = currentYear;
      if (month <= 0) { month += 12; year -= 1; }

      const existing = await Payroll.findOne({ employee: emp._id, month, year });
      if (existing) continue;

      const basic = emp.salary;
      const allowances = Math.round(basic * 0.2);         // 20% HRA + travel
      const pf = Math.round(basic * 0.12);                // 12% PF
      const tax = Math.round(basic * 0.05);               // 5% TDS
      const deductions = pf + tax;
      const netPay = basic + allowances - deductions;
      const isCurrentMonth = (month === currentMonth && year === currentYear);
      const status = isCurrentMonth ? 'processed' : 'paid';

      await Payroll.create({ employee: emp._id, month, year, basic, allowances, deductions, netPay, status });
      count++;
    }
    console.log(`   ✔ ${emp.fullName} — 6 months payroll`);
  }
  console.log(`   Total: ${count} payroll records created`);
}

// ── Attendance seed ───────────────────────────────────────────
async function seedAttendance(employees) {
  console.log('\n📅 Seeding attendance...');
  let count = 0;
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  // Seed attendance for last 2 months
  const months = [];
  for (let i = 1; i >= 0; i--) {
    let m = currentDate.getMonth() + 1 - i;
    let y = year;
    if (m <= 0) { m += 12; y -= 1; }
    months.push({ month: m, year: y });
  }

  for (const emp of employees) {
    let empCount = 0;
    for (const { month, year: yr } of months) {
      const workingDays = getWorkingDays(yr, month);
      for (const date of workingDays) {
        // Don't seed future dates
        if (date > currentDate) continue;

        const existing = await Attendance.findOne({ employee: emp._id, date });
        if (existing) continue;

        // Weighted random: mostly present
        const roll = Math.random();
        let status, checkIn, checkOut, workHours;

        if (roll < 0.75) {
          // Present
          status = 'present';
          const startHour = randomInt(8, 10);
          const startMin = randomItem([0, 15, 30, 45]);
          checkIn = new Date(date);
          checkIn.setHours(startHour, startMin, 0, 0);
          const hoursWorked = randomInt(7, 10);
          checkOut = new Date(checkIn);
          checkOut.setHours(checkIn.getHours() + hoursWorked, randomInt(0, 59), 0, 0);
          workHours = +(( checkOut - checkIn) / 3600000).toFixed(2);
        } else if (roll < 0.85) {
          // Half day
          status = 'half_day';
          checkIn = new Date(date);
          checkIn.setHours(9, 0, 0, 0);
          checkOut = new Date(date);
          checkOut.setHours(13, 0, 0, 0);
          workHours = 4;
        } else if (roll < 0.92) {
          // On leave
          status = 'on_leave';
          workHours = 0;
        } else {
          // Absent
          status = 'absent';
          workHours = 0;
        }

        await Attendance.create({ employee: emp._id, date, checkIn, checkOut, status, workHours });
        empCount++;
        count++;
      }
    }
    console.log(`   ✔ ${emp.fullName} — ${empCount} attendance records`);
  }
  console.log(`   Total: ${count} attendance records created`);
}

// ── Main ──────────────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`✅ Connected to MongoDB (${mongoose.connection.name})`);

    const employees = await Employee.find({ isDeleted: false });
    if (employees.length === 0) {
      console.log('⚠️  No employees found. Run seedEmployees.js first.');
      return;
    }
    console.log(`👥 Found ${employees.length} employees`);

    await seedLeaves(employees);
    await seedPayroll(employees);
    await seedAttendance(employees);

    console.log('\n🎉 All HR data seeded successfully!');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    console.error(err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected.');
  }
}

seed();
