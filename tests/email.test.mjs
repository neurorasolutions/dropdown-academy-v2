import { test } from 'node:test'
import assert from 'node:assert/strict'
import { build } from 'esbuild'
import { mkdirSync } from 'node:fs'
mkdirSync('.cache/tests', { recursive: true })
for (const name of ['welcome', 'request-reset'])
    await build({
        entryPoints: [`api/${name}.ts`],
        outfile: `.cache/tests/${name}.mjs`,
        bundle: true,
        platform: 'node',
        format: 'esm',
        packages: 'external',
    })
const welcome = (await import('../.cache/tests/welcome.mjs')).default
const requestReset = (await import('../.cache/tests/request-reset.mjs')).default

process.env.VITE_SUPABASE_URL = 'https://test.supabase.co'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-server-key'
process.env.VITE_APP_URL = 'https://www.dropdownacademy.com'
process.env.RESEND_API_KEY = 'test-resend-key'

const user = '11111111-1111-4111-8111-111111111111'
let profile, sent, invalidToken, generateError, dbDown, resendDown

function reset() {
    profile = { full_name: 'Mario Rossi', welcome_sent: false }
    sent = []
    invalidToken = false
    generateError = false
    dbDown = false
    resendDown = false
}

const json = (value, status = 200) =>
    new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json' } })

globalThis.fetch = async (input, init = {}) => {
    const u = new URL(typeof input === 'string' ? input : input.url)
    const method = init.method || 'GET'
    const body = init.body ? JSON.parse(init.body) : null
    if (u.hostname.endsWith('supabase.co') && u.pathname === '/auth/v1/user')
        return invalidToken ? json({ message: 'Invalid JWT' }, 401) : json({ id: user, email: 'mario@example.test' })
    if (u.pathname === '/auth/v1/admin/generate_link') {
        if (generateError) return json({ message: 'User not found' }, 404)
        return json({ action_link: 'https://test.supabase.co/verify?token=RESET', email_otp: '123456' })
    }
    if (u.pathname.includes('dropdown_profiles')) {
        if (dbDown) return json({ message: 'offline' }, 503)
        if (method === 'PATCH') return json({ id: user })
        return json(profile)
    }
    if (u.hostname === 'api.resend.com' && u.pathname === '/emails') {
        if (resendDown) throw new Error('network down')
        sent.push(body)
        return json({ id: 'email-id' })
    }
    throw new Error(`Unexpected test request ${method} ${u.href}`)
}

async function call(handler, body = {}, headers = { authorization: 'Bearer test-token' }, method = 'POST') {
    let status = 200,
        payload
    const res = {
        setHeader() {},
        status(s) {
            status = s
            return this
        },
        json(v) {
            payload = v
            return this
        },
    }
    await handler({ method, body, headers }, res)
    return { status, payload }
}

test('welcome email is sent once and marked in the profile', async () => {
    reset()
    const r = await call(welcome)
    assert.equal(r.status, 200)
    assert.equal(r.payload.success, true)
    assert.equal(sent.length, 1)
    assert.match(sent[0].subject, /Benvenuto/i)
    assert.match(sent[0].html, /Mario Rossi/)
    assert.equal(sent[0].to[0], 'mario@example.test')
})

test('welcome email is skipped when already sent', async () => {
    reset()
    profile.welcome_sent = true
    const r = await call(welcome)
    assert.equal(r.status, 200)
    assert.equal(r.payload.skipped, true)
    assert.equal(sent.length, 0)
})

test('welcome email requires authentication', async () => {
    reset()
    assert.equal((await call(welcome, {}, {})).status, 401)
    invalidToken = true
    assert.equal((await call(welcome)).status, 401)
})

test('password reset returns generic success and emails a branded link', async () => {
    reset()
    const r = await call(requestReset, { email: 'mario@example.test' })
    assert.equal(r.status, 200)
    assert.equal(r.payload.success, true)
    assert.equal(sent.length, 1)
    assert.match(sent[0].html, /reset-password|verify\?token=RESET/)
})

test('password reset hides unknown users (no enumeration)', async () => {
    reset()
    generateError = true
    const r = await call(requestReset, { email: 'unknown@example.test' })
    assert.equal(r.status, 200)
    assert.equal(r.payload.success, true)
    assert.equal(sent.length, 0)
})

test('password reset validates the email format', async () => {
    reset()
    assert.equal((await call(requestReset, { email: 'not-an-email' })).status, 400)
})

test('email delivery failure is reported without leaking provider details', async () => {
    reset()
    resendDown = true
    const r = await call(welcome)
    assert.equal(r.status, 500)
    assert.doesNotMatch(JSON.stringify(r.payload), /network down/)
})
