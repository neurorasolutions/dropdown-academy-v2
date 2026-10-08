import { test } from 'node:test'
import assert from 'node:assert/strict'
import { build } from 'esbuild'
import { mkdirSync } from 'node:fs'
mkdirSync('.cache/tests', { recursive: true })
for (const name of ['create-order', 'capture-order', 'sitemap'])
    await build({
        entryPoints: [`api/${name}.ts`],
        outfile: `.cache/tests/${name}.mjs`,
        bundle: true,
        platform: 'node',
        format: 'esm',
        packages: 'external',
    })
const create = (await import('../.cache/tests/create-order.mjs')).default
const capture = (await import('../.cache/tests/capture-order.mjs')).default
const sitemap = (await import('../.cache/tests/sitemap.mjs')).default
process.env.VITE_SUPABASE_URL = 'https://test.supabase.co'
process.env.VITE_SUPABASE_ANON_KEY = 'test-anon'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-server-key'
process.env.VITE_PAYPAL_CLIENT_ID = 'test-client'
process.env.PAYPAL_CLIENT_SECRET = 'test-secret'
process.env.PAYPAL_MODE = 'sandbox'
const user = '11111111-1111-4111-8111-111111111111',
    course = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
let purchase, order, captures, failSave, invalidToken, hidden, owned, dbDown
function reset() {
    purchase = {
        id: 'purchase-id',
        user_id: user,
        course_id: course,
        paypal_order_id: 'ORDER123',
        amount_paid: 15,
        status: 'pending',
    }
    order = {
        id: 'ORDER123',
        status: 'APPROVED',
        purchase_units: [
            { reference_id: course, custom_id: user, amount: { value: '15.00', currency_code: 'EUR' } },
        ],
    }
    captures = 0
    failSave = false
    invalidToken = false
    hidden = false
    owned = false
    dbDown = false
}
const json = (value, status = 200) =>
    new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json' } })
globalThis.fetch = async (input, init = {}) => {
    const u = new URL(typeof input === 'string' ? input : input.url)
    const method = init.method || 'GET'
    const body = init.body ? JSON.parse(init.body.startsWith('{') ? init.body : '{}') : null
    if (u.pathname === '/auth/v1/user')
        return invalidToken
            ? json({ message: 'Invalid JWT' }, 401)
            : json({ id: user, email: 'test@example.test' })
    if (u.pathname.includes('dropdown_courses') && u.searchParams.get('select') === 'slug,updated_at')
        return json([{ slug: 'published-course', updated_at: '2026-09-10T10:00:00Z' }])
    if (u.pathname.includes('dropdown_courses'))
        return dbDown
            ? json({ message: 'offline' }, 503)
            : json(hidden ? null : { id: course, title: 'Test course', price: 15 })
    if (u.pathname.includes('dropdown_purchases')) {
        if (method === 'POST') {
            purchase = { ...body, id: 'purchase-id' }
            return json(null, 201)
        }
        if (method === 'PATCH') {
            if (failSave) return json({ message: 'write failed' }, 500)
            purchase = { ...purchase, ...body }
            return json({ id: purchase.id })
        }
        if (u.searchParams.has('paypal_order_id')) return json(purchase?.user_id === user ? purchase : null)
        if (u.searchParams.has('id')) return json({ status: purchase.status })
        return json(owned ? [{ id: 'owned' }] : [])
    }
    if (u.pathname === '/v1/oauth2/token') return json({ access_token: 'paypal-token' })
    if (u.pathname === '/v2/checkout/orders') {
        assert.equal(body.purchase_units[0].custom_id, user)
        assert.equal(body.purchase_units[0].amount.value, '15.00')
        return json(order)
    }
    if (u.pathname.endsWith('/capture')) {
        captures++
        order.status = 'COMPLETED'
        order.purchase_units[0].payments = {
            captures: [
                { id: 'CAPTURE123', status: 'COMPLETED', amount: { value: '15.00', currency_code: 'EUR' } },
            ],
        }
        return json(order)
    }
    if (u.pathname === '/v2/checkout/orders/ORDER123') return json(order)
    throw new Error(`Unexpected test request ${u.pathname}`)
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
        send(v) {
            payload = v
            return this
        },
    }
    await handler({ method, body, headers }, res)
    return { status, payload }
}
test('unauthenticated and invalid-token requests cannot create payments', async () => {
    reset()
    assert.equal((await call(create, { courseSlug: 'test-course' }, {})).status, 401)
    invalidToken = true
    assert.equal((await call(create, { courseSlug: 'test-course' })).status, 401)
})
test('hidden courses and database failures never fall back to static prices', async () => {
    reset()
    hidden = true
    assert.equal((await call(create, { courseSlug: 'test-course' })).status, 404)
    hidden = false
    dbDown = true
    assert.equal((await call(create, { courseSlug: 'test-course' })).status, 503)
})
test('already-owned course cannot be purchased again', async () => {
    reset()
    owned = true
    assert.equal((await call(create, { courseSlug: 'test-course' })).status, 409)
})
test('create records authenticated order with server price before approval', async () => {
    reset()
    assert.equal((await call(create, { courseSlug: 'test-course', price: 0.01 })).status, 200)
    assert.equal(purchase.status, 'pending')
    assert.equal(purchase.amount_paid, 15)
    assert.equal(purchase.user_id, user)
})
test('foreign user or wrong currency cannot capture', async () => {
    reset()
    purchase.user_id = 'other'
    assert.equal((await call(capture, { orderID: 'ORDER123' })).status, 404)
    reset()
    order.purchase_units[0].amount.currency_code = 'USD'
    assert.equal((await call(capture, { orderID: 'ORDER123' })).status, 409)
    assert.equal(captures, 0)
})
test('wrong course, user or amount rejected before money moves', async () => {
    for (const change of [
        (u) => (u.reference_id = 'other'),
        (u) => (u.custom_id = 'other'),
        (u) => (u.amount.value = '0.01'),
    ]) {
        reset()
        change(order.purchase_units[0])
        assert.equal((await call(capture, { orderID: 'ORDER123' })).status, 409)
        assert.equal(captures, 0)
    }
})
test('repeat capture grants access exactly once', async () => {
    reset()
    assert.equal((await call(capture, { orderID: 'ORDER123' })).payload.success, true)
    assert.equal(purchase.status, 'completed')
    assert.equal((await call(capture, { orderID: 'ORDER123' })).payload.success, true)
    assert.equal(captures, 1)
})
test('payment received but DB failure is pending; retry never charges again', async () => {
    reset()
    failSave = true
    const first = await call(capture, { orderID: 'ORDER123' })
    assert.equal(first.status, 202)
    assert.equal(first.payload.success, false)
    assert.equal(first.payload.pending, true)
    failSave = false
    assert.equal((await call(capture, { orderID: 'ORDER123' })).payload.success, true)
    assert.equal(captures, 1)
})
test('unapproved order and refunded purchase cannot complete', async () => {
    reset()
    order.status = 'CREATED'
    assert.equal((await call(capture, { orderID: 'ORDER123' })).status, 409)
    reset()
    purchase.status = 'refunded'
    assert.equal((await call(capture, { orderID: 'ORDER123' })).status, 409)
    assert.equal(captures, 0)
})
test('invalid IDs and methods are rejected', async () => {
    reset()
    assert.equal((await call(capture, { orderID: '../../other' })).status, 400)
    assert.equal((await call(create, {}, undefined, 'GET')).status, 405)
})

test('sitemap contains published courses and excludes private pages', async () => {
    reset()
    const result = await call(sitemap, {}, undefined, 'GET')
    assert.equal(result.status, 200)
    assert.match(result.payload, /courses\/published-course/)
    assert.doesNotMatch(result.payload, /dashboard|certificate|admin/)
    assert.match(result.payload, /<lastmod>2026-09-10<\/lastmod>/)
})
