import { body } from 'express-validator'

const phoneRegex = /^\+?[0-9\s()-]{7,20}$/
const usernameRegex = /^[a-zA-Z0-9_.-]+$/

export const signupValidator = [
    body('firstname')
        .trim()
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ max: 50 })
        .withMessage('First name cannot exceed 50 characters'),

    body('lastname')
        .trim()
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({ max: 50 })
        .withMessage('Last name cannot exceed 50 characters'),

    body('phone')
        .trim()
        .notEmpty()
        .withMessage('Phone is required')
        .matches(phoneRegex)
        .withMessage('Please provide a valid phone number'),

    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),

    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(usernameRegex)
        .withMessage(
            'Username can contain only letters, numbers, dots, underscores and hyphens',
        )
        .toLowerCase(),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must contain at least 8 characters')
        .custom((value) => {
            if (Buffer.byteLength(value, 'utf8') > 72) {
                throw new Error('Password cannot exceed 72 bytes')
            }

            return true
        }),

    body('confirmPassword')
        .notEmpty()
        .withMessage('Confirm password is required')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password and confirm password do not match')
            }

            return true
        }),
]

export const signinValidator = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .toLowerCase(),

    body('password').notEmpty().withMessage('Password is required'),
]
