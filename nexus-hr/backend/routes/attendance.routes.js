const express = require('express');
const attendanceController = require('../controllers/attendanceController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/', attendanceController.list);
router.post('/check-in', attendanceController.checkIn);
router.post('/check-out', attendanceController.checkOut);

module.exports = router;
