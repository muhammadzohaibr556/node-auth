import express from 'express'

import authenticate from '../middleware/auth.middleware.js'

import {
    getUserDetail,
    updateUserDetail,
} from '../controllers/user.controller.js'

import { updateUserValidator } from '../validators/user.validator.js'

import validateRequest from '../middleware/validate.middleware.js'

const router = express.Router()

// All routes below require authentication
router.use(authenticate)

router.get('/me', getUserDetail)

router.patch('/me', updateUserValidator, validateRequest, updateUserDetail)

export default router
