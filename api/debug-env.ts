import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
    return res.status(200).json({
        supabaseUrl: process.env.VITE_SUPABASE_URL || 'NOT SET',
        paypalMode: process.env.PAYPAL_MODE || 'NOT SET',
        paypalClientIdPrefix: (process.env.VITE_PAYPAL_CLIENT_ID || 'NOT SET').slice(0, 10),
        hasSecret: !!process.env.PAYPAL_CLIENT_SECRET,
    })
}
