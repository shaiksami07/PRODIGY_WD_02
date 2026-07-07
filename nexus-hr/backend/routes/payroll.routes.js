const express = require('express');
const payrollController = require('../controllers/payrollController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

const router = express.Router();
router.use(protect, authorize('admin', 'hr'));

router.get('/', payrollController.list);
router.post('/preview', payrollController.generatePreview);

module.exports = router;
