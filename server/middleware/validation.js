const { body, param, validationResult } = require('express-validator');

// Middleware to handle validation results
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: errors.array().map(error => ({
                field: error.path,
                message: error.msg,
                value: error.value
            }))
        });
    }
    next();
};

// User validation schemas
const validateRegister = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    body('role')
        .isIn(['admin', 'data-entry'])
        .withMessage('Role must be either admin or data-entry'),
    handleValidationErrors
];

const validateLogin = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    handleValidationErrors
];

// Bill validation schemas
const validateCreateBill = [
    body('title')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Title is required and must be less than 100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must be less than 500 characters'),
    body('date')
        .optional()
        .isISO8601()
        .withMessage('Date must be a valid ISO 8601 date'),
    handleValidationErrors
];

const validateUpdateBill = [
    param('id')
        .isMongoId()
        .withMessage('Invalid bill ID'),
    body('title')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Title must be between 1 and 100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must be less than 500 characters'),
    body('date')
        .optional()
        .isISO8601()
        .withMessage('Date must be a valid ISO 8601 date'),
    handleValidationErrors
];

// Expense validation schemas
const validateCreateExpense = [
    body('bill')
        .isMongoId()
        .withMessage('Valid bill ID is required'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Description must be less than 200 characters'),
    body('category')
        .isIn(['tv', 'stand', 'transport'])
        .withMessage('Category must be one of: tv, stand, transport'),
    body('amount')
        .isFloat({ min: 0.01 })
        .withMessage('Amount must be a positive number'),
    body('paymentBy')
        .trim()
        .notEmpty()
        .withMessage('Payment by is required'),
    body('date')
        .optional()
        .isISO8601()
        .withMessage('Date must be a valid ISO 8601 date'),
    handleValidationErrors
];

const validateUpdateExpense = [
    param('id')
        .isMongoId()
        .withMessage('Invalid expense ID'),
    body('bill')
        .optional()
        .isMongoId()
        .withMessage('Bill ID must be valid'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Description must be less than 200 characters'),
    body('category')
        .optional()
        .isIn(['tv', 'stand', 'transport'])
        .withMessage('Category must be one of: tv, stand, transport'),
    body('amount')
        .optional()
        .isFloat({ min: 0.01 })
        .withMessage('Amount must be a positive number'),
    body('paymentBy')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Payment by cannot be empty'),
    body('date')
        .optional()
        .isISO8601()
        .withMessage('Date must be a valid ISO 8601 date'),
    handleValidationErrors
];

// ID validation for params
const validateMongoId = [
    param('id')
        .isMongoId()
        .withMessage('Invalid ID format'),
    handleValidationErrors
];

const validateBillId = [
    param('billId')
        .isMongoId()
        .withMessage('Invalid bill ID format'),
    handleValidationErrors
];

module.exports = {
    validateRegister,
    validateLogin,
    validateCreateBill,
    validateUpdateBill,
    validateCreateExpense,
    validateUpdateExpense,
    validateMongoId,
    validateBillId,
    handleValidationErrors
};
