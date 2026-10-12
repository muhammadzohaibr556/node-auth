import assert from 'node:assert/strict'
import { once } from 'node:events'
import { test } from 'node:test'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import app from '../dist/app.js'
import User from '../dist/models/user.model.js'
import generateToken from '../dist/utils/generateToken.js'
import { requiredEnv } from '../dist/config/env.js'

test('typed backend preserves validation, authentication and user serialization', async () => {
    const originalSecret = process.env.JWT_SECRET
    const originalExpiry = process.env.JWT_EXPIRES_IN
    process.env.JWT_SECRET = 'test-only-secret'
    process.env.JWT_EXPIRES_IN = '7d'
    let server

    try {
        const user = new User({
            firstname: 'Test', lastname: 'User', phone: '+1234567890',
            email: 'test@example.com', username: 'testuser',
            password: await bcrypt.hash('password123', 4),
        })
        await user.validate()
        assert.equal(await user.comparePassword('password123'), true)
        assert.equal(await user.comparePassword('incorrect'), false)
        assert.equal('password' in user.toJSON(), false)
        assert.equal('__v' in user.toJSON(), false)
        const decoded = jwt.verify(generateToken(user._id), process.env.JWT_SECRET)
        assert.equal(decoded.userId, user._id.toString())
        assert.equal(decoded.exp - decoded.iat, 7 * 24 * 60 * 60)

        server = app.listen(0, '127.0.0.1')
        await once(server, 'listening')
        const base = `http://127.0.0.1:${server.address().port}`
        for (const [path, options, status, message] of [
            ['/api/v1/health', {}, 200, 'API is running'],
            ['/missing', {}, 404, 'Route not found: GET /missing'],
            ['/api/v1/users/me', {}, 401, 'Authentication token is required'],
            ['/api/v1/users/me', { headers: { authorization: 'Bearer invalid' } }, 401, 'Invalid or expired token'],
            ['/api/v1/users/me', { headers: { authorization: `Bearer ${jwt.sign({ userId: 123 }, process.env.JWT_SECRET)}` } }, 401, 'Invalid or expired token'],
            ['/api/v1/auth/signup', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' }, 400, 'Validation failed'],
            ['/api/v1/auth/signin', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' }, 400, 'Validation failed'],
        ]) {
            const response = await fetch(base + path, options)
            assert.equal(response.status, status, path)
            assert.equal((await response.json()).message, message, path)
        }

        delete process.env.JWT_SECRET
        assert.throws(() => requiredEnv('JWT_SECRET'), /JWT_SECRET is not defined/)
        assert.throws(() => generateToken(user._id), /JWT_SECRET is not defined/)
    } finally {
        if (server?.listening) await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
        if (originalSecret === undefined) delete process.env.JWT_SECRET
        else process.env.JWT_SECRET = originalSecret
        if (originalExpiry === undefined) delete process.env.JWT_EXPIRES_IN
        else process.env.JWT_EXPIRES_IN = originalExpiry
    }
})
