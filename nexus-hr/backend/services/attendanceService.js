const Attendance = require('../models/Attendance');
const { ApiError } = require('../utils/apiResponse');

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

async function checkIn(employeeId) {
  const today = startOfDay(new Date());
  const existing = await Attendance.findOne({ employee: employeeId, date: today });
  if (existing && existing.checkIn) throw new ApiError(400, 'Already checked in today');

  return Attendance.findOneAndUpdate(
    { employee: employeeId, date: today },
    { checkIn: new Date(), status: 'present' },
    { upsert: true, new: true }
  );
}

async function checkOut(employeeId) {
  const today = startOfDay(new Date());
  const record = await Attendance.findOne({ employee: employeeId, date: today });
  if (!record || !record.checkIn) throw new ApiError(400, 'Must check in before checking out');
  if (record.checkOut) throw new ApiError(400, 'Already checked out today');

  record.checkOut = new Date();
  record.workHours = Math.round(((record.checkOut - record.checkIn) / (1000 * 60 * 60)) * 100) / 100;
  await record.save();
  return record;
}

async function listAttendance({ employee, from, to, page = 1, limit = 31 } = {}) {
  const filter = {};
  if (employee) filter.employee = employee;
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = startOfDay(from);
    if (to) filter.date.$lte = startOfDay(to);
  }
  const [items, total] = await Promise.all([
    Attendance.find(filter)
      .populate('employee', 'fullName employeeId')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Attendance.countDocuments(filter),
  ]);
  return { items, total, page, limit };
}

async function attendanceRate(days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const [present, total] = await Promise.all([
    Attendance.countDocuments({ date: { $gte: since }, status: 'present' }),
    Attendance.countDocuments({ date: { $gte: since } }),
  ]);
  return total === 0 ? 0 : Math.round((present / total) * 100);
}

module.exports = { checkIn, checkOut, listAttendance, attendanceRate };
