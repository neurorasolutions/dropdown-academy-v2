import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
export default async function handler(_req: VercelRequest, res: VercelResponse) {
    const origin = 'https://www.dropdownacademy.com'
    try {
        const db = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!)
        const { data, error } = await db
            .from('dropdown_courses')
            .select('slug,updated_at')
            .eq('is_published', true)
        if (error) throw error
        const urls = [
            '',
            '/courses',
            '/in-presenza',
            '/community',
            '/free-videos',
            '/downloads',
            '/contact',
            '/faq',
            '/privacy',
            '/terms',
            '/cookies',
        ].map((path) => `<url><loc>${origin}${path}</loc></url>`)
        for (const c of data || [])
            urls.push(
                `<url><loc>${origin}/courses/${encodeURIComponent(c.slug)}</loc><lastmod>${new Date(c.updated_at).toISOString().slice(0, 10)}</lastmod></url>`,
            )
        res.setHeader('Content-Type', 'application/xml; charset=utf-8')
        res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=3600')
        return res
            .status(200)
            .send(
                `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`,
            )
    } catch {
        return res.status(503).send('Sitemap temporaneamente non disponibile')
    }
}
