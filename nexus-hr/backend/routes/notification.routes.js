const express = require('express');
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/', notificationController.list);
router.patch('/:id/read', notificationController.markRead);
router.patch('/read-all', notificationController.markAllRead);

module.exports = router;
