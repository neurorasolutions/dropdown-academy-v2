import type { VercelRequest, VercelResponse } from '@vercel/node'

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
        const { orderID } = req.body

        if (!orderID) {
            return res.status(400).json({ error: 'orderID is required' })
        }

        const accessToken = await getPayPalAccessToken()

        // Capture the PayPal order (finalize payment)
        const response = await fetch(
            `${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            }
        )

        if (!response.ok) {
            const errorData = await response.json()
            console.error('PayPal capture error:', errorData)
            return res.status(500).json({ error: 'Failed to capture PayPal order' })
        }

        const captureData = await response.json()

        // Payment successful
        if (captureData.status === 'COMPLETED') {
            const capture = captureData.purchase_units[0].payments.captures[0]

            return res.status(200).json({
                success: true,
                transactionId: capture.id,
                status: captureData.status,
                amount: capture.amount.value,
                currency: capture.amount.currency_code,
            })
        }

        return res.status(400).json({
            success: false,
            status: captureData.status,
            error: 'Payment not completed',
        })

    } catch (error) {
        console.error('Capture order error:', error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}
