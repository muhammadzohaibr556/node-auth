import type { InferSchemaType } from 'mongoose'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
        },

        lastname: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            minlength: 3,
            maxlength: 30,
        },

        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false,
        },
    },
    {
        timestamps: true,
        methods: {
            // Mongoose infers the document and method types from the schema.
            comparePassword(password: string): Promise<boolean> {
                return bcrypt.compare(password, this.password)
            },
        },
    },
)

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return
    }

    this.password = await bcrypt.hash(this.password, 12)
})

// Never return password in JSON response
userSchema.set('toJSON', {
    transform: function (_document, returnedObject) {
        const { password, __v, ...user } = returnedObject
        return user
    },
})

export type UserData = InferSchemaType<typeof userSchema>

const User = mongoose.model('User', userSchema)

export default User
