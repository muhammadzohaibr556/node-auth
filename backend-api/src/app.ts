import express from 'express'

import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'

import { notFoundHandler, errorHandler } from './middleware/error.middleware.js'

const app = express()

// Parse JSON request body
app.use(
    express.json({
        limit: '10kb',
    }),
)

// Health check
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is running',
    })
})

// Routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)

// 404
app.use(notFoundHandler)

// Error handler must be last
app.use(errorHandler)

export default app
