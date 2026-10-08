import type { VercelRequest, VercelResponse } from '@vercel/node'
import { randomUUID } from 'node:crypto'
import { ApiError, authenticate, input, paypal, paypalToken } from '../server/payment.js'
export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Cache-Control', 'no-store')
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST')
        return res.status(405).json({ error: 'Metodo non consentito.' })
    }
    try {
        const slug = input(req.body?.courseSlug, 'Corso', /^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        const { db, user } = await authenticate(req)
        const { data: course, error } = await db
            .from('dropdown_courses')
            .select('id,title,price')
            .eq('slug', slug)
            .eq('is_published', true)
            .maybeSingle()
        if (error) throw new ApiError(503, 'Catalogo temporaneamente non disponibile.')
        if (!course) throw new ApiError(404, 'Corso non disponibile.')
        const price = Number(course.price)
        if (!Number.isFinite(price) || price <= 0) throw new ApiError(400, 'Prezzo non valido.')
        const { data: owned, error: ownedError } = await db
            .from('dropdown_purchases')
            .select('id')
            .eq('user_id', user.id)
            .eq('course_id', course.id)
            .eq('status', 'completed')
            .limit(1)
        if (ownedError) throw new ApiError(503, 'Impossibile verificare gli acquisti.')
        if (owned?.length)
            throw new ApiError(409, 'Hai già acquistato questo corso. Aprilo dalla tua area personale.')
        const token = await paypalToken()
        const order = await paypal(
            '/v2/checkout/orders',
            token,
            'POST',
            {
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        reference_id: course.id,
                        custom_id: user.id,
                        description: course.title,
                        amount: { currency_code: 'EUR', value: price.toFixed(2) },
                    },
                ],
            },
            randomUUID(),
        )
        const { error: insertError } = await db
            .from('dropdown_purchases')
            .insert({
                user_id: user.id,
                course_id: course.id,
                paypal_order_id: order.id,
                amount_paid: price,
                status: 'pending',
            })
        if (insertError)
            throw new ApiError(503, 'Impossibile registrare l’ordine. Nessun pagamento è stato addebitato.')
        return res.status(200).json({ orderID: order.id })
    } catch (error) {
        return res
            .status(error instanceof ApiError ? error.status : 500)
            .json({
                error:
                    error instanceof ApiError
                        ? error.message
                        : 'Impossibile creare l’ordine. Riprova più tardi.',
            })
    }
}
