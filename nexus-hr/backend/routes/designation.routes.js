const express = require('express');
const designationController = require('../controllers/designationController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

const router = express.Router();
router.use(protect);

router.get('/', designationController.list);
router.post('/', authorize('admin', 'hr'), designationController.create);

module.exports = router;
