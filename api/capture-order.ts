import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const PAYPAL_API_BASE = process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

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
        const { orderID, courseSlug, userToken } = req.body

        if (!orderID) {
            return res.status(400).json({ error: 'orderID is required' })
        }
        if (!courseSlug) {
            return res.status(400).json({ error: 'courseSlug is required' })
        }
        if (!userToken) {
            return res.status(401).json({ error: 'User not authenticated' })
        }

        // Client per operazioni autenticate per conto dell'utente (RLS applica auth.uid())
        const supabaseUser = createClient(
            supabaseUrl || 'https://demo.supabase.co',
            supabaseAnonKey || 'demo-key',
            {
                global: { headers: { Authorization: `Bearer ${userToken}` } },
            }
        )

        // Verifica identità utente dal token
        const { data: userData, error: userError } = await supabaseUser.auth.getUser()
        if (userError || !userData?.user) {
            return res.status(401).json({ error: 'Invalid user token' })
        }
        const userId = userData.user.id

        // Recupera il corso e il prezzo dal database (fonte autoritativa)
        const { data: course, error: courseError } = await supabaseUser
            .from('dropdown_courses')
            .select('id, title, price')
            .eq('slug', courseSlug)
            .single()

        if (courseError || !course) {
            return res.status(404).json({ error: 'Course not found' })
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
            const paidAmount = Number(capture.amount.value)
            const expectedPrice = Number(course.price)

            // Il prezzo pagato deve corrispondere al prezzo del corso
            if (Math.abs(paidAmount - expectedPrice) > 0.001) {
                console.error(`Amount mismatch: paid ${paidAmount}, expected ${expectedPrice}`)
                return res.status(400).json({
                    success: false,
                    error: `Importo non corrispondente (pagato €${paidAmount}, atteso €${expectedPrice}). Contatta l'assistenza.`,
                    transactionId: capture.id,
                })
            }

            // Registra l'acquisto server-side (RLS valida auth.uid() = user_id tramite il token)
            const { error: insertError } = await supabaseUser
                .from('dropdown_purchases')
                .insert({
                    user_id: userId,
                    course_id: course.id,
                    paypal_order_id: orderID,
                    amount_paid: paidAmount,
                    status: 'completed',
                    payment_date: new Date().toISOString(),
                })

            if (insertError) {
                // Il pagamento è andato a buon fine ma la registrazione no: log severo.
                // L'utente è autorizzato comunque a ricevere il corso (gestione manuale possibile
                // tramite l'ID transazione PayPal).
                console.error('Purchase insert failed after successful capture:', insertError)
                return res.status(200).json({
                    success: true,
                    transactionId: capture.id,
                    warning: 'payment_recorded_pending',
                    message: 'Pagamento completato: la registrazione dell\'accesso è in fase di completamento. Contattaci se il corso non appare entro 1 ora.',
                })
            }

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