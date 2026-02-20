// FILE PATH: backend/middleware/validator.middleware.js

const { body, validationResult } = require('express-validator');

/**
 * Handle validation errors
 */
exports.handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map((err) => ({
                field: err.path,
                message: err.msg,
            })),
        });
    }
    next();
};

/**
 * Registration validation rules
 */
exports.validateRegistration = [
    body('firstName')
        .trim()
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be 2-50 characters'),

    body('lastName')
        .trim()
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be 2-50 characters'),

    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),

    body('phone')
        .trim()
        .notEmpty()
        .withMessage('Phone number is required')
        .matches(/^[6-9]\d{9}$/)
        .withMessage('Please provide a valid 10-digit phone number'),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain uppercase, lowercase, and number'),

    body('age')
        .notEmpty()
        .withMessage('Age is required')
        .isInt({ min: 1, max: 120 })
        .withMessage('Age must be between 1 and 120'),

    body('gender')
        .notEmpty()
        .withMessage('Gender is required')
        .isIn(['Male', 'Female', 'Other', 'Prefer not to say'])
        .withMessage('Invalid gender option'),

    body('language')
        .optional()
        .trim(),

    body('bloodGroup')
        .optional()
        .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''])
        .withMessage('Invalid blood group'),
];

/**
 * Login validation rules
 */
exports.validateLogin = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email or phone is required'),

    body('password')
        .notEmpty()
        .withMessage('Password is required'),
];

/**
 * Symptom submission validation
 */
exports.validateSymptoms = [
    body('symptoms')
        .trim()
        .notEmpty()
        .withMessage('Symptoms are required')
        .isLength({ min: 3 })
        .withMessage('Please provide more details about symptoms'),

    body('language')
        .optional()
        .trim(),
];

