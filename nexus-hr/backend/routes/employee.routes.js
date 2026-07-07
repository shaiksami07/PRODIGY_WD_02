const express = require('express');
const employeeController = require('../controllers/employeeController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const handleValidation = require('../validators/handleValidation');
const { createEmployeeRules, updateEmployeeRules } = require('../validators/employeeValidators');

const router = express.Router();

router.use(protect);

router.get('/birthdays/upcoming', employeeController.upcomingBirthdays);
router.get('/', employeeController.list);
router.get('/:id', employeeController.getOne);
router.post('/', authorize('admin', 'hr'), createEmployeeRules, handleValidation, employeeController.create);
router.put('/:id', authorize('admin', 'hr'), updateEmployeeRules, handleValidation, employeeController.update);
router.delete('/:id', authorize('admin', 'hr'), employeeController.remove);
router.patch('/:id/restore', authorize('admin', 'hr'), employeeController.restore);
router.post('/bulk-delete', authorize('admin', 'hr'), employeeController.bulkDelete);

module.exports = router;
