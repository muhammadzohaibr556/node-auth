import type { ErrorRequestHandler, RequestHandler } from 'express'
import mongoose from 'mongoose'

type HttpError = Error & {
    statusCode?: number
    code?: number
    keyValue?: Record<string, unknown>
}

export const notFoundHandler: RequestHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    })
}

export const errorHandler: ErrorRequestHandler = (caught: unknown, req, res, next) => {
    const error: HttpError = caught instanceof Error ? caught : new Error('Internal server error')
    // MongoDB unique field error
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue || {})[0]

        return res.status(409).json({
            success: false,
            message: `${field || 'Value'} already exists`,
        })
    }

    // Mongoose validation error
    if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({
            success: false,
            message: 'Database validation failed',
            errors: Object.values(error.errors).map((item) => ({
                field: item.path,
                message: item.message,
            })),
        })
    }

    const statusCode = error.statusCode || 500

    if (statusCode >= 500) {
        console.error(error)
    }

    res.status(statusCode).json({
        success: false,
        message:
            statusCode === 500 && process.env.NODE_ENV === 'production'
                ? 'Internal server error'
                : error.message || 'Internal server error',
    })
}
