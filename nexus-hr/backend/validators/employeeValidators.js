const { body } = require('express-validator');

exports.createEmployeeRules = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('department').isMongoId().withMessage('Valid department id is required'),
  body('designation').isMongoId().withMessage('Valid designation id is required'),
  body('joiningDate').isISO8601().withMessage('Valid joining date is required'),
  body('salary').isFloat({ min: 0 }).withMessage('Salary must be a positive number'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other', 'prefer_not_to_say'])
    .withMessage('Invalid gender value'),
];

exports.updateEmployeeRules = [
  body('email').optional().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').optional().notEmpty().withMessage('Phone cannot be empty'),
  body('salary').optional().isFloat({ min: 0 }).withMessage('Salary must be a positive number'),
];
