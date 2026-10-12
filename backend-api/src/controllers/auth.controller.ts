import type { RequestHandler } from 'express'
import type { UserData } from '../models/user.model.js'

type SignupBody = Pick<UserData, 'firstname' | 'lastname' | 'phone' | 'email' | 'username' | 'password'> & { confirmPassword: string }
type SigninBody = Pick<SignupBody, 'username' | 'password'>

import User from '../models/user.model.js'
import ApiError from '../utils/ApiError.js'
import generateToken from '../utils/generateToken.js'

export const signup: RequestHandler<{}, unknown, SignupBody> = async (req, res) => {
    const { firstname, lastname, phone, email, username, password } = req.body

    // Check duplicate email
    const existingEmail = await User.findOne({ email })

    if (existingEmail) {
        throw new ApiError(409, 'Email is already registered')
    }

    // Check duplicate username
    const existingUsername = await User.findOne({ username })

    if (existingUsername) {
        throw new ApiError(409, 'Username is already taken')
    }

    const user = await User.create({
        firstname,
        lastname,
        phone,
        email,
        username,
        password,
    })

    const token = generateToken(user._id)

    res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
            token,
            user,
        },
    })
}

export const signin: RequestHandler<{}, unknown, SigninBody> = async (req, res) => {
    const { username, password } = req.body

    // Password has select:false, so explicitly include it here
    const user = await User.findOne({ username }).select('+password')

    if (!user) {
        throw new ApiError(401, 'Invalid username or password')
    }

    const passwordIsValid = await user.comparePassword(password)

    if (!passwordIsValid) {
        throw new ApiError(401, 'Invalid username or password')
    }

    const token = generateToken(user._id)

    res.status(200).json({
        success: true,
        message: 'Signin successful',
        data: {
            token,
            user,
        },
    })
}
