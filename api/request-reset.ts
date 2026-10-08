import type { VercelRequest, VercelResponse } from '@vercel/node'
import { ApiError, database, input } from '../server/payment.js'
import { sendEmail, resetTemplate, emailConfigured } from '../server/email.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Cache-Control', 'no-store')
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST')
        return res.status(405).json({ error: 'Metodo non consentito.' })
    }
    try {
        const email = input(req.body?.email, 'Email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/)
        if (!emailConfigured()) throw new ApiError(503, 'Invio email temporaneamente non disponibile.')
        const db = database()

        const raw = String(req.headers.origin || '')
        const origin = /^https:\/\/(www\.)?dropdownacademy\.com$/.test(raw)
            ? raw
            : 'https://www.dropdownacademy.com'
        const { data, error } = await db.auth.admin.generateLink({
            type: 'recovery',
            email,
            options: { redirectTo: `${origin}/reset-password` },
        })
        if (error) {
            if (/not found/i.test(error.message))
                return res.status(200).json({ success: true })
            throw new ApiError(503, 'Richiesta temporaneamente non disponibile.')
        }
        const link = data?.properties?.action_link
        if (link) {
            const { subject, html } = resetTemplate(link)
            await sendEmail(email, subject, html)
        }
        return res.status(200).json({ success: true })
    } catch (error) {
        return res
            .status(error instanceof ApiError ? error.status : 500)
            .json({ error: error instanceof ApiError ? error.message : 'Invio email non riuscito.' })
    }
}
