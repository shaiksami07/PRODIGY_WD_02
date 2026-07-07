const Notification = require('../models/Notification');

async function notify({ recipient, title, message, type = 'info', link = null }) {
  return Notification.create({ recipient, title, message, type, link });
}

async function listForUser(userId, { unreadOnly = false, page = 1, limit = 20 } = {}) {
  const filter = { recipient: userId };
  if (unreadOnly) filter.isRead = false;

  const [items, total] = await Promise.all([
    Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Notification.countDocuments(filter),
  ]);

  return { items, total, page, limit };
}

async function markRead(id, userId) {
  return Notification.findOneAndUpdate({ _id: id, recipient: userId }, { isRead: true }, { new: true });
}

async function markAllRead(userId) {
  return Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });
}

module.exports = { notify, listForUser, markRead, markAllRead };
