const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

function write(level, message, meta) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] [${level.toUpperCase()}] ${message}${
    meta ? ' ' + JSON.stringify(meta) : ''
  }`;

  // eslint-disable-next-line no-console
  console[level === 'error' ? 'error' : 'log'](line);

  try {
    fs.appendFileSync(path.join(logsDir, 'app.log'), line + '\n');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[logger] Failed to write log file:', err.message);
  }
}

module.exports = {
  info: (message, meta) => write('info', message, meta),
  warn: (message, meta) => write('warn', message, meta),
  error: (message, meta) => write('error', message, meta),
};
