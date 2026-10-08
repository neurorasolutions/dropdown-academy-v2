import type { VercelRequest, VercelResponse } from '@vercel/node'
import { ApiError, database, input } from '../server/payment.js'
import { sendEmail, welcomeTemplate, emailConfigured } from '../server/email.js'

const FRESH_WINDOW_MS = 30 * 60 * 1000

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Cache-Control', 'no-store')
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST')
        return res.status(405).json({ error: 'Metodo non consentito.' })
    }
    try {
        const email = input(req.body?.email, 'Email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/)
        if (!emailConfigured()) return res.status(200).json({ success: true, skipped: true })
        const db = database()

        const { data: profile, error } = await db
            .from('dropdown_profiles')
            .select('id,full_name,welcome_sent,created_at')
            .eq('email', email.trim().toLowerCase())
            .maybeSingle()
        if (error) throw new ApiError(503, 'Invio email temporaneamente non disponibile.')
        if (!profile || profile.welcome_sent) return res.status(200).json({ success: true, skipped: true })
        if (Date.now() - new Date(profile.created_at).getTime() > FRESH_WINDOW_MS)
            return res.status(200).json({ success: true, skipped: true })

        const { subject, html } = welcomeTemplate(profile.full_name || '')
        await sendEmail(email, subject, html)
        await db.from('dropdown_profiles').update({ welcome_sent: true }).eq('id', profile.id)
        return res.status(200).json({ success: true })
    } catch (error) {
        return res
            .status(error instanceof ApiError ? error.status : 500)
            .json({ error: error instanceof ApiError ? error.message : 'Invio email non riuscito.' })
    }
}
