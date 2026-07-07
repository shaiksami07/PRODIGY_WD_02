const express = require('express');
const departmentController = require('../controllers/departmentController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const handleValidation = require('../validators/handleValidation');
const { createDepartmentRules } = require('../validators/departmentValidators');

const router = express.Router();
router.use(protect);

router.get('/', departmentController.list);
router.get('/:id', departmentController.getOne);
router.post('/', authorize('admin', 'hr'), createDepartmentRules, handleValidation, departmentController.create);
router.put('/:id', authorize('admin', 'hr'), departmentController.update);
router.delete('/:id', authorize('admin', 'hr'), departmentController.remove);

module.exports = router;
