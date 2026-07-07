const express = require('express');
const auditLogController = require('../controllers/auditLogController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

const router = express.Router();
router.use(protect, authorize('admin'));

router.get('/', auditLogController.list);

module.exports = router;
