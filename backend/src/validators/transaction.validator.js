const { body } = require('express-validator');

const createTransactionValidator = [
  body('amount')
    .isFloat({ min: 0.01, max: 9999999999.99 })
    .withMessage('Amount must be between 0.01 and 9,999,999,999.99'),
  body('type')
    .isIn(['INCOME', 'EXPENSE'])
    .withMessage('Type must be INCOME or EXPENSE'),
  body('category')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category is required (max 50 characters)'),
  body('date')
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes can be at most 500 characters'),
];

const updateTransactionValidator = [
  body('amount')
    .optional()
    .isFloat({ min: 0.01, max: 9999999999.99 })
    .withMessage('Amount must be between 0.01 and 9,999,999,999.99'),
  body('type')
    .optional()
    .isIn(['INCOME', 'EXPENSE'])
    .withMessage('Type must be INCOME or EXPENSE'),
  body('category')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category is required (max 50 characters)'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes can be at most 500 characters'),
];

module.exports = { createTransactionValidator, updateTransactionValidator };
