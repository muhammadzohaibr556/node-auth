import assert from 'node:assert/strict'
import { test } from 'node:test'
import { signupSchema, signinSchema, profileSchema, authResponseSchema, profileResponseSchema } from '../src/lib/schemas.ts'
import { ApiError, request } from '../src/lib/api.ts'

const signup = {
  firstname: ' Alex ', lastname: 'Morgan', email: 'alex@example.com', phone: '+1 555 123 4567',
  username: ' Alex.M ', password: 'password123', confirmPassword: 'password123',
}
const user = { ...profileSchema.parse(signup), _id: 'user-id', username: 'alex.m' }

test('Zod validates and normalizes signup, signin and profile input', () => {
  const parsed = signupSchema.parse(signup)
  assert.equal(parsed.firstname, 'Alex')
  assert.equal(parsed.username, 'alex.m')
  for (const invalid of [
    { confirmPassword: 'different' }, { password: 'short' }, { email: 'invalid' },
    { phone: 'invalid' }, { username: 'a b' }, { firstname: '' },
    { password: 'é'.repeat(37), confirmPassword: 'é'.repeat(37) },
  ]) assert.equal(signupSchema.safeParse({ ...signup, ...invalid }).success, false)
  assert.equal(signinSchema.parse({ username: ' Alex.M ', password: 'x' }).username, 'alex.m')
  assert.equal(signinSchema.safeParse({ username: '', password: '' }).success, false)
  assert.equal('password' in profileSchema.parse(signup), false)
  assert.equal(authResponseSchema.safeParse({ success: true, data: { token: 'token', user } }).success, true)
  assert.equal(authResponseSchema.safeParse({ success: true, data: { token: '' } }).success, false)
})

test('API sends credentials, validates responses, and preserves server errors', async () => {
  const originalFetch = globalThis.fetch
  try {
    globalThis.fetch = async (url, options) => {
      assert.equal(url, '/api/v1/users/me')
      assert.equal(options?.method, 'PATCH')
      assert.equal(new Headers(options?.headers).get('Authorization'), 'Bearer token')
      assert.equal(new Headers(options?.headers).get('Content-Type'), 'application/json')
      assert.deepEqual(JSON.parse(String(options?.body)), { firstname: 'Alex' })
      return Response.json({ success: true, data: { user } })
    }
    assert.deepEqual(await request('/users/me', profileResponseSchema, {
      method: 'PATCH', token: 'token', body: { firstname: 'Alex' },
    }), { success: true, data: { user } })

    globalThis.fetch = async () => Response.json({ message: 'Validation failed', errors: [{ field: 'email', message: 'Already taken' }] }, { status: 400 })
    await assert.rejects(request('/users/me', profileResponseSchema), (error: unknown) => {
      assert.ok(error instanceof ApiError)
      assert.equal(error.status, 400)
      assert.equal(error.fields.email, 'Already taken')
      return true
    })
    globalThis.fetch = async () => Response.json({ message: 'Expired token' }, { status: 401 })
    await assert.rejects(request('/users/me', profileResponseSchema), { status: 401 })
    globalThis.fetch = async () => Response.json({ invalid: true })
    await assert.rejects(request('/users/me', profileResponseSchema), /unexpected response/)
    globalThis.fetch = async () => new Response('Proxy unavailable', { status: 502 })
    await assert.rejects(request('/users/me', profileResponseSchema), { status: 502 })
    globalThis.fetch = async () => { throw new TypeError('Network failed') }
    await assert.rejects(request('/users/me', profileResponseSchema), /Cannot reach the server/)
  } finally { globalThis.fetch = originalFetch }
})
