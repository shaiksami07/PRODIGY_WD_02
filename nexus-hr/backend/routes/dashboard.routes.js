const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/summary', dashboardController.summary);
router.get('/charts/department-distribution', dashboardController.departmentDistribution);
router.get('/charts/gender-distribution', dashboardController.genderDistribution);
router.get('/charts/hiring-trend', dashboardController.hiringTrend);
router.get('/birthdays', dashboardController.upcomingBirthdays);

module.exports = router;
