const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const rateLimit = require('express-rate-limit');

const env = require('./config/env');
const { sendSuccess } = require('./utils/apiResponse');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ------------------------------
// Security & core middleware
// ------------------------------
app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(env.cookieSecret));
app.use(mongoSanitize());
app.use(xssClean());

if (env.nodeEnv !== 'test') {
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
}

// Global rate limiter (auth routes get a stricter one added in Phase 3)
const globalLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.', data: null, errors: null },
});
app.use('/api', globalLimiter);

// ------------------------------
// Health check
// ------------------------------
app.get('/api/health', (req, res) => {
  sendSuccess(res, {
    message: 'NexusHR API is running',
    data: {
      environment: env.nodeEnv,
      timestamp: new Date().toISOString(),
    },
  });
});

// ------------------------------
// API routes
// ------------------------------
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/employees', require('./routes/employee.routes'));
app.use('/api/departments', require('./routes/department.routes'));
app.use('/api/designations', require('./routes/designation.routes'));
app.use('/api/leaves', require('./routes/leave.routes'));
app.use('/api/attendance', require('./routes/attendance.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/audit-logs', require('./routes/auditLog.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));
app.use('/api/payroll', require('./routes/payroll.routes'));

// ------------------------------
// 404 + error handling (must be last)
// ------------------------------
app.use(notFound);
app.use(errorHandler);

module.exports = app;
