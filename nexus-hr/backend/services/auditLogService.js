const AuditLog = require('../models/AuditLog');
const logger = require('../utils/logger');

async function record({ user, action, resource, resourceId, before = null, after = null, req = null }) {
  try {
    await AuditLog.create({
      user: user || null,
      action,
      resource,
      resourceId,
      before,
      after,
      ip: req ? req.ip : undefined,
      userAgent: req ? req.headers['user-agent'] : undefined,
    });
  } catch (err) {
    // Auditing must never break the primary request
    logger.error('Failed to write audit log', { error: err.message, action, resource });
  }
}

module.exports = { record };
