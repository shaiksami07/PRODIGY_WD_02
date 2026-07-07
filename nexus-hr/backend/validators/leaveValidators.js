const { body } = require('express-validator');

exports.createLeaveRules = [
  body('type')
    .isIn(['sick', 'casual', 'earned', 'unpaid', 'maternity', 'paternity'])
    .withMessage('Invalid leave type'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('reason').trim().notEmpty().withMessage('Reason is required'),
];

exports.reviewLeaveRules = [
  body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
];
