import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(
    supabaseUrl || 'https://demo.supabase.co',
    supabaseAnonKey || 'demo-key',
    { db: { schema: 'dropdown' } }
)

// Hardcoded course prices — must match frontend to prevent tampering
const COURSE_PRICES: Record<string, { title: string; price: number }> = {
    'synth-modulare-completo': { title: 'Synth Modulare Completo', price: 50 },
    'ableton-live-masterclass': { title: 'Ableton Live Masterclass', price: 60 },
    'serum-sound-design': { title: 'Serum Sound Design', price: 60 },
    'max-msp-fondamenti': { title: 'Max MSP Fondamenti', price: 60 },
    'pigments-masterclass': { title: 'Pigments Masterclass', price: 15 },
    'reaktor-blocks': { title: 'Reaktor Blocks Completo', price: 50 },
}

const PAYPAL_API_BASE = process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'

async function getPayPalAccessToken(): Promise<string> {
    const clientId = process.env.VITE_PAYPAL_CLIENT_ID
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET

    if (!clientId || !clientSecret) {
        throw new Error('PayPal credentials not configured')
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

    const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    })

    if (!response.ok) {
        throw new Error(`PayPal auth failed: ${response.statusText}`)
    }

    const data = await response.json()
    return data.access_token
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    try {
        const { courseSlug } = req.body

        if (!courseSlug) {
            return res.status(400).json({ error: 'courseSlug is required' })
        }

        // Try to fetch course details dynamically from Supabase first
        let course: { title: string; price: number } | null = null

        if (supabaseUrl && supabaseUrl !== 'https://demo.supabase.co') {
            try {
                const { data, error } = await supabase
                    .from('dropdown_courses')
                    .select('title, price')
                    .eq('slug', courseSlug)
                    .single()

                if (data && !error) {
                    course = {
                        title: data.title,
                        price: Number(data.price),
                    }
                } else if (error) {
                    console.error('Supabase query error for courseSlug:', courseSlug, error)
                }
            } catch (err) {
                console.error('Exception fetching course from Supabase:', err)
            }
        }

        // Fallback to hardcoded prices if not found or in demo mode
        if (!course) {
            course = COURSE_PRICES[courseSlug]
        }

        if (!course) {
            return res.status(404).json({ error: 'Course not found' })
        }

        const accessToken = await getPayPalAccessToken()

        // Create PayPal order with server-validated price
        const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        description: course.title,
                        amount: {
                            currency_code: 'EUR',
                            value: course.price.toFixed(2),
                        },
                    },
                ],
            }),
        })

        if (!response.ok) {
            const errorData = await response.json()
            console.error('PayPal create order error:', errorData)
            return res.status(500).json({ error: 'Failed to create PayPal order' })
        }

        const order = await response.json()
        return res.status(200).json({ orderID: order.id })

    } catch (error) {
        console.error('Create order error:', error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}
