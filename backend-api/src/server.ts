import 'dotenv/config'

import app from './app.js'
import connectDB from './config/db.js'
import { requiredEnv } from './config/env.js'

const PORT = process.env.PORT || 5000

const startServer = async () => {
    try {
        requiredEnv('MONGO_URI')
        requiredEnv('JWT_SECRET')

        await connectDB()

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`)
        })
    } catch (error) {
        console.error('Failed to start server:')
        console.error(error)

        process.exit(1)
    }
}

startServer()
