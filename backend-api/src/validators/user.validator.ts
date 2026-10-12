import { body } from 'express-validator'

const phoneRegex = /^\+?[0-9\s()-]{7,20}$/

export const updateUserValidator = [
    body('firstname')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('First name cannot be empty')
        .isLength({ max: 50 })
        .withMessage('First name cannot exceed 50 characters'),

    body('lastname')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Last name cannot be empty')
        .isLength({ max: 50 })
        .withMessage('Last name cannot exceed 50 characters'),

    body('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),

    body('phone')
        .optional()
        .trim()
        .matches(phoneRegex)
        .withMessage('Please provide a valid phone number'),
]
