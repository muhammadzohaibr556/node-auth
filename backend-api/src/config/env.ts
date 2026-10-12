export const requiredEnv = (name: 'MONGO_URI' | 'JWT_SECRET'): string => {
    const value = process.env[name]
    if (!value) throw new Error(`${name} is not defined`)
    return value
}
