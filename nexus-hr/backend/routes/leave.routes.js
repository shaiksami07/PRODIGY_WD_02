const express = require('express');
const leaveController = require('../controllers/leaveController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const handleValidation = require('../validators/handleValidation');
const { createLeaveRules, reviewLeaveRules } = require('../validators/leaveValidators');

const router = express.Router();
router.use(protect);

router.get('/', leaveController.list);
router.post('/', createLeaveRules, handleValidation, leaveController.create);
router.patch('/:id/review', authorize('admin', 'hr', 'manager'), reviewLeaveRules, handleValidation, leaveController.review);
router.patch('/:id/cancel', leaveController.cancel);

module.exports = router;
