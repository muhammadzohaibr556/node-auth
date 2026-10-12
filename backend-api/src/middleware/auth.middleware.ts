import type { RequestHandler } from 'express'
import { requiredEnv } from '../config/env.js'
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

const authenticate: RequestHandler = async (req, res, next) => {
    const authorization = req.headers.authorization

    if (!authorization?.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Authentication token is required',
        })
    }

    const token = authorization.split(' ')[1]

    try {
        const decoded = jwt.verify(token, requiredEnv('JWT_SECRET'))

        if (typeof decoded === 'string' || typeof decoded.userId !== 'string') {
            throw new Error('Invalid token payload')
        }

        const user = await User.findById(decoded.userId)

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User associated with this token no longer exists',
            })
        }

        req.userId = user._id

        next()
    } catch {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
        })
    }
}

export default authenticate
