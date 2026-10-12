import { z } from 'zod'

const name = z.string().trim().min(1, 'This field is required').max(50, 'Use 50 characters or fewer')

export const profileSchema = z.object({
  firstname: name,
  lastname: name,
  email: z.string().trim().email('Enter a valid email address'),
  phone: z.string().trim().regex(/^\+?[0-9\s()-]{7,20}$/, 'Enter a valid phone number'),
})

export const signinSchema = z.object({
  username: z.string().trim().min(1, 'Enter your username').toLowerCase(),
  password: z.string().min(1, 'Enter your password'),
})

export const signupSchema = profileSchema.extend({
  username: z.string().trim().min(3, 'Use at least 3 characters').max(30, 'Use 30 characters or fewer')
    .regex(/^[a-zA-Z0-9_.-]+$/, 'Use letters, numbers, dots, underscores or hyphens').toLowerCase(),
  password: z.string().min(8, 'Use at least 8 characters')
    .refine(value => new TextEncoder().encode(value).length <= 72, 'Password cannot exceed 72 bytes'),
  confirmPassword: z.string().min(1, 'Confirm your password'),
}).refine(value => value.password === value.confirmPassword, {
  path: ['confirmPassword'], message: 'Passwords do not match',
})

export const userSchema = profileSchema.extend({
  _id: z.string(),
  username: z.string(),
  createdAt: z.string().optional(),
})
export const profileResponseSchema = z.object({ success: z.literal(true), data: z.object({ user: userSchema }) })
export const authResponseSchema = z.object({
  success: z.literal(true), data: z.object({ token: z.string().min(1), user: userSchema }),
})

export type User = z.infer<typeof userSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type SigninInput = z.infer<typeof signinSchema>
export type SignupInput = z.infer<typeof signupSchema>
