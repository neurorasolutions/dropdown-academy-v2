import { createClient } from '@supabase/supabase-js'
import type { VercelRequest } from '@vercel/node'
import type { Database } from '../src/types/database'
export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
    ) {
        super(message)
    }
}
export function database() {
    const url = process.env.VITE_SUPABASE_URL,
        key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) throw new ApiError(503, 'Pagamenti temporaneamente non disponibili.')
    return createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}
export async function authenticate(req: VercelRequest) {
    const token = req.headers.authorization?.replace(/^Bearer /, '')
    if (!token) throw new ApiError(401, 'Accedi per continuare.')
    const db = database()
    const { data, error } = await db.auth.getUser(token)
    if (error || !data.user) throw new ApiError(401, 'Sessione scaduta. Accedi di nuovo.')
    return { db, user: data.user }
}
export function input(value: unknown, label: string, pattern: RegExp) {
    if (typeof value !== 'string' || !pattern.test(value)) throw new ApiError(400, `${label} non valido.`)
    return value
}
export function paypalBase() {
    return process.env.PAYPAL_MODE === 'live'
        ? 'https://api-m.paypal.com'
        : 'https://api-m.sandbox.paypal.com'
}
export async function paypalToken() {
    const id = process.env.VITE_PAYPAL_CLIENT_ID,
        secret = process.env.PAYPAL_CLIENT_SECRET
    if (!id || !secret) throw new ApiError(503, 'Pagamenti temporaneamente non disponibili.')
    const res = await fetch(`${paypalBase()}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
        signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) throw new ApiError(502, 'PayPal non disponibile. Riprova più tardi.')
    const json = (await res.json()) as { access_token: string }
    return json.access_token
}
export type PayPalOrder = {
    id: string
    status: string
    purchase_units: {
        custom_id: string
        reference_id: string
        amount: { value: string; currency_code: string }
        payments?: {
            captures: { id: string; status: string; amount: { value: string; currency_code: string } }[]
        }
    }[]
}
export async function paypal(
    path: string,
    token: string,
    method = 'GET',
    body?: unknown,
    requestId?: string,
): Promise<PayPalOrder> {
    const res = await fetch(`${paypalBase()}${path}`, {
        method,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Prefer: 'return=representation',
            ...(requestId ? { 'PayPal-Request-Id': requestId } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(20000),
    })
    if (!res.ok)
        throw new ApiError(502, 'PayPal non ha confermato l’operazione. Riprova con lo stesso ordine.')
    return (await res.json()) as PayPalOrder
}
export function matchesOrder(order: PayPalOrder, userId: string, courseId: string, amount: number) {
    const unit = order.purchase_units?.[0]
    return (
        order.purchase_units?.length === 1 &&
        unit.custom_id === userId &&
        unit.reference_id === courseId &&
        unit.amount?.currency_code === 'EUR' &&
        Number.isFinite(Number(unit.amount.value)) &&
        Math.round(Number(unit.amount.value) * 100) === Math.round(amount * 100)
    )
}
