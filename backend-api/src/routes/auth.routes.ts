import express from 'express'

import { signup, signin } from '../controllers/auth.controller.js'

import {
    signupValidator,
    signinValidator,
} from '../validators/auth.validator.js'

import validateRequest from '../middleware/validate.middleware.js'

const router = express.Router()

router.post('/signup', signupValidator, validateRequest, signup)

router.post('/signin', signinValidator, validateRequest, signin)

export default router
