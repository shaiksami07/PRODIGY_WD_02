/**
 * Seed notifications for the admin user.
 * Run: node seedNotifications.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Employee = require('./models/Employee');
const Notification = require('./models/Notification');

const MONGO_URI = process.env.MONGO_URI;

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`✅ Connected to MongoDB (${mongoose.connection.name})`);

    const admin = await User.findOne({ role: 'super_admin' });
    if (!admin) {
      console.log('⚠️  No admin user found. Run seed.js first.');
      return;
    }

    const employees = await Employee.find({ isDeleted: false });
    const empNames = employees.map((e) => e.fullName);

    const notifications = [
      // Leave notifications
      {
        title: 'Leave Request Approved',
        message: `${empNames[0] || 'Arjun Mehta'}'s sick leave request for 2 days has been approved.`,
        type: 'success',
        link: '/leaves',
        isRead: false,
        createdAt: daysAgo(0),
      },
      {
        title: 'New Leave Request',
        message: `${empNames[3] || 'Sneha Patel'} has submitted a casual leave request for 3 days starting next Monday.`,
        type: 'info',
        link: '/leaves',
        isRead: false,
        createdAt: daysAgo(0),
      },
      {
        title: 'Leave Request Pending Review',
        message: `${empNames[5] || 'Ananya Singh'} has requested earned leave for 5 days. Please review.`,
        type: 'warning',
        link: '/leaves',
        isRead: false,
        createdAt: daysAgo(1),
      },
      // Payroll notifications
      {
        title: 'Payroll Processed',
        message: 'June 2026 payroll has been processed for all 10 employees. Total payout: ₹10,45,000.',
        type: 'success',
        link: '/payroll',
        isRead: false,
        createdAt: daysAgo(1),
      },
      {
        title: 'Payroll Due This Week',
        message: 'July 2026 payroll is due in 3 days. Please review and approve salary slips.',
        type: 'warning',
        link: '/payroll',
        isRead: false,
        createdAt: daysAgo(2),
      },
      // Attendance notifications
      {
        title: 'Attendance Alert',
        message: `${empNames[6] || 'Vikram Nair'} has been marked absent for 3 consecutive days this week.`,
        type: 'error',
        link: '/attendance',
        isRead: false,
        createdAt: daysAgo(2),
      },
      {
        title: 'Low Attendance Warning',
        message: `${empNames[8] || 'Rohan Gupta'}'s attendance this month is below 80%. HR review recommended.`,
        type: 'warning',
        link: '/attendance',
        isRead: true,
        createdAt: daysAgo(3),
      },
      // Employee notifications
      {
        title: 'New Employee Onboarded',
        message: `${empNames[9] || 'Meera Joshi'} has successfully completed onboarding and joined the Operations team.`,
        type: 'success',
        link: '/employees',
        isRead: true,
        createdAt: daysAgo(4),
      },
      {
        title: 'Employee Profile Incomplete',
        message: `${empNames[2] || 'Rahul Verma'}'s profile is missing bank details and emergency contact information.`,
        type: 'warning',
        link: '/employees',
        isRead: true,
        createdAt: daysAgo(5),
      },
      {
        title: 'Work Anniversary',
        message: `🎉 ${empNames[4] || 'Kiran Rao'} is completing 7 years with NexusHR today. Consider recognizing their contribution!`,
        type: 'info',
        link: '/employees',
        isRead: true,
        createdAt: daysAgo(6),
      },
      // Department / system notifications
      {
        title: 'New Department Created',
        message: "The 'Product Management' department has been created and is ready for employee assignments.",
        type: 'info',
        link: '/departments',
        isRead: true,
        createdAt: daysAgo(7),
      },
      {
        title: 'System Backup Completed',
        message: 'Weekly database backup completed successfully at 02:00 AM. All records are safe.',
        type: 'success',
        link: null,
        isRead: true,
        createdAt: daysAgo(7),
      },
      {
        title: 'Security Alert',
        message: 'A login was detected from a new device. If this was not you, please change your password immediately.',
        type: 'error',
        link: '/settings',
        isRead: false,
        createdAt: daysAgo(0),
      },
      {
        title: 'Performance Review Due',
        message: 'Q2 performance reviews are due by end of this month. 6 employees are yet to be reviewed.',
        type: 'warning',
        link: '/employees',
        isRead: false,
        createdAt: daysAgo(3),
      },
      {
        title: 'Holiday Calendar Updated',
        message: 'The company holiday calendar for H2 2026 has been published. 8 holidays added.',
        type: 'info',
        link: null,
        isRead: true,
        createdAt: daysAgo(10),
      },
    ];

    // Delete old notifications for clean slate
    await Notification.deleteMany({ recipient: admin._id });

    // Insert with correct timestamps
    for (const n of notifications) {
      await Notification.create({
        recipient: admin._id,
        title: n.title,
        message: n.message,
        type: n.type,
        link: n.link,
        isRead: n.isRead,
        createdAt: n.createdAt,
        updatedAt: n.createdAt,
      });
    }

    const unread = notifications.filter((n) => !n.isRead).length;
    console.log(`✅ Created ${notifications.length} notifications (${unread} unread) for ${admin.email}`);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected.');
  }
}

seed();
