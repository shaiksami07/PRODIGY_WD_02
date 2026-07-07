const dotenv = require('dotenv');
dotenv.config();

const required = ['MONGO_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET', 'COOKIE_SECRET'];

function validateEnv() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0 && process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.warn(
      `[env] Warning: missing environment variables: ${missing.join(', ')}. ` +
        'Copy .env.example to .env and fill in real values before running in production.'
    );
  }
}

validateEnv();

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nexus_hr',

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'dev_access_secret_change_me',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_me',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  cookieSecret: process.env.COOKIE_SECRET || 'dev_cookie_secret_change_me',

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 300,
  },

  upload: {
    maxSizeMb: parseInt(process.env.MAX_UPLOAD_SIZE_MB, 10) || 5,
  },

  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12,

  isProd: (process.env.NODE_ENV || 'development') === 'production',
};
