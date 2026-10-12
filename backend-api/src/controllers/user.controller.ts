import type { RequestHandler } from 'express'
import type { UserData } from '../models/user.model.js'

type UpdateUserBody = Partial<Pick<UserData, 'firstname' | 'lastname' | 'email' | 'phone'>>

import User from '../models/user.model.js'
import ApiError from '../utils/ApiError.js'

export const getUserDetail: RequestHandler = async (req, res) => {
    const user = await User.findById(req.userId)

    if (!user) {
        throw new ApiError(404, 'User not found')
    }

    res.status(200).json({
        success: true,
        data: {
            user,
        },
    })
}

export const updateUserDetail: RequestHandler<{}, unknown, UpdateUserBody> = async (req, res) => {
    const allowedFields = ['firstname', 'lastname', 'email', 'phone'] as const

    const updates: UpdateUserBody = {}

    for (const field of allowedFields) {
        if (Object.prototype.hasOwnProperty.call(req.body, field)) {
            updates[field] = req.body[field]
        }
    }

    if (Object.keys(updates).length === 0) {
        throw new ApiError(
            400,
            'Provide at least one field to update: first, last, email or phone',
        )
    }

    const user = await User.findByIdAndUpdate(req.userId, updates, {
        new: true,
        runValidators: true,
    })

    if (!user) {
        throw new ApiError(404, 'User not found')
    }

    res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: {
            user,
        },
    })
}
