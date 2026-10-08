import type { VercelRequest, VercelResponse } from '@vercel/node'
import { ApiError, authenticate } from '../server/payment.js'
import { sendEmail, welcomeTemplate, emailConfigured } from '../server/email.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Cache-Control', 'no-store')
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST')
        return res.status(405).json({ error: 'Metodo non consentito.' })
    }
    try {
        const { db, user } = await authenticate(req)
        const { data: profile, error } = await db
            .from('dropdown_profiles')
            .select('full_name,welcome_sent')
            .eq('id', user.id)
            .maybeSingle()
        if (error) throw new ApiError(503, 'Profilo temporaneamente non disponibile.')
        if (!profile || profile.welcome_sent) return res.status(200).json({ success: true, skipped: true })
        if (!emailConfigured()) return res.status(200).json({ success: false, skipped: true })

        const { subject, html } = welcomeTemplate(profile.full_name || '')
        await sendEmail(user.email || '', subject, html)

        await db.from('dropdown_profiles').update({ welcome_sent: true }).eq('id', user.id)
        return res.status(200).json({ success: true })
    } catch (error) {
        return res
            .status(error instanceof ApiError ? error.status : 500)
            .json({ error: error instanceof ApiError ? error.message : 'Invio email non riuscito.' })
    }
}
