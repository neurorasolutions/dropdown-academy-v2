import type { VercelRequest, VercelResponse } from '@vercel/node'
import { ApiError, authenticate, input, paypal, paypalToken, matchesOrder } from '../server/payment.js'
export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Cache-Control', 'no-store')
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST')
        return res.status(405).json({ error: 'Metodo non consentito.' })
    }
    try {
        const orderID = input(req.body?.orderID, 'Ordine', /^[A-Z0-9]{5,64}$/)
        const { db, user } = await authenticate(req)
        const { data: purchase, error } = await db
            .from('dropdown_purchases')
            .select('*')
            .eq('paypal_order_id', orderID)
            .eq('user_id', user.id)
            .maybeSingle()
        if (error) throw new ApiError(503, 'Impossibile verificare l’ordine.')
        if (!purchase) throw new ApiError(404, 'Ordine non trovato per questo account.')
        if (purchase.status === 'refunded' || purchase.status === 'failed')
            throw new ApiError(409, 'Questo ordine non può essere completato.')
        if (purchase.status === 'completed')
            return res.status(200).json({ success: true, transactionId: orderID })
        const token = await paypalToken()
        let order = await paypal(`/v2/checkout/orders/${orderID}`, token)
        if (!matchesOrder(order, user.id, purchase.course_id, Number(purchase.amount_paid)))
            throw new ApiError(409, 'I dati PayPal non corrispondono all’ordine.')
        if (order.status !== 'COMPLETED') {
            if (order.status !== 'APPROVED')
                throw new ApiError(409, 'Approva il pagamento su PayPal prima di continuare.')
            try {
                order = await paypal(
                    `/v2/checkout/orders/${orderID}/capture`,
                    token,
                    'POST',
                    undefined,
                    `capture-${orderID}`,
                )
            } catch {
                order = await paypal(`/v2/checkout/orders/${orderID}`, token)
            }
        }
        const captures = order.purchase_units?.[0]?.payments?.captures
        const capture = captures?.[0]
        if (
            order.status !== 'COMPLETED' ||
            captures?.length !== 1 ||
            capture?.status !== 'COMPLETED' ||
            capture.amount.currency_code !== 'EUR' ||
            Math.round(Number(capture.amount.value) * 100) !== Math.round(Number(purchase.amount_paid) * 100)
        )
            throw new ApiError(
                409,
                'Pagamento non ancora completato. Verifica lo stesso ordine prima di riprovare.',
            )
        const { error: saveError } = await db
            .from('dropdown_purchases')
            .update({ status: 'completed', payment_date: new Date().toISOString() })
            .eq('id', purchase.id)
            .eq('status', 'pending')
            .select('id')
            .single()
        if (saveError) {
            const { data: existing } = await db
                .from('dropdown_purchases')
                .select('status')
                .eq('id', purchase.id)
                .single()
            if (existing?.status !== 'completed')
                return res
                    .status(202)
                    .json({
                        success: false,
                        pending: true,
                        orderID,
                        transactionId: capture.id,
                        error: 'Pagamento ricevuto. Premi «Verifica accesso» per completare l’attivazione senza un nuovo addebito.',
                    })
        }
        return res.status(200).json({ success: true, transactionId: capture.id })
    } catch (error) {
        return res
            .status(error instanceof ApiError ? error.status : 500)
            .json({
                error:
                    error instanceof ApiError
                        ? error.message
                        : 'Impossibile verificare il pagamento. Conserva il numero d’ordine e riprova.',
            })
    }
}
