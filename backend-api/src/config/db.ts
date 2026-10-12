import { requiredEnv } from './env.js'
import mongoose from 'mongoose'

const connectDB = async () => {
    await mongoose.connect(requiredEnv('MONGO_URI'))

    console.log(
        `MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`,
    )
}

export default connectDB
