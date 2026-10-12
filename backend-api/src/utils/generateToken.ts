import type { Types } from 'mongoose'
import type { SignOptions } from 'jsonwebtoken'
import { requiredEnv } from '../config/env.js'
import jwt from 'jsonwebtoken'

const generateToken = (userId: Types.ObjectId) => {
    return jwt.sign(
        {
            userId: userId.toString(),
        },
        requiredEnv('JWT_SECRET'),
        {
            expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'],
        },
    )
}

export default generateToken
