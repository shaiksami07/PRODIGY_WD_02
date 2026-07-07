const { body } = require('express-validator');

exports.createDepartmentRules = [
  body('name').trim().notEmpty().withMessage('Department name is required'),
  body('code').trim().notEmpty().withMessage('Department code is required'),
];
