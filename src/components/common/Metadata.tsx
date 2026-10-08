import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE = 'https://www.dropdownacademy.com'
const DEFAULT_IMAGE = `${SITE}/logo-transparent.png`

const titles: Record<string, string> = {
    '/': 'Sound Design e Produzione Musicale',
    '/courses': 'Corsi online',
    '/in-presenza': 'Corsi in presenza',
    '/community': 'Community',
    '/downloads': 'Download gratuiti',
    '/free-videos': 'Video gratuiti',
    '/contact': 'Contatti',
    '/faq': 'Domande frequenti',
    '/login': 'Accedi',
    '/register': 'Registrati',
    '/dashboard': 'I tuoi corsi',
    '/privacy': 'Privacy',
    '/terms': 'Termini di servizio',
    '/cookies': 'Cookie',
    '/reset-password': 'Nuova password',
}

const descriptions: Record<string, string> = {
    '/': 'Formazione premium di sound design e produzione musicale. Corsi online e masterclass in presenza.',
    '/courses': 'Catalogo dei corsi online di Dropdown Academy: synth, sound design, Ableton, Max/MSP e molto altro.',
    '/in-presenza': 'Masterclass e corsi in presenza a Vigevano: formazione dal vivo su sound design e produzione.',
    '/downloads': 'Preset, sample pack e risorse gratuite da scaricare per le tue produzioni musicali.',
    '/free-videos': 'Tutorial gratuiti di sound design e produzione musicale dal canale YouTube di Dropdown Academy.',
}

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
    let el = document.head.querySelector<HTMLMetaElement>(selector)
    if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.append(el)
    }
    el.setAttribute('content', content)
}

interface MetadataProps {
    title?: string
    description?: string
    image?: string
    noindex?: boolean
}

export function Metadata({ title, description, image, noindex }: MetadataProps) {
    const { pathname } = useLocation()
    useEffect(() => {
        const base = title || titles[pathname] || 'Formazione musicale'
        const full = `${base} | Dropdown Academy`
        const desc = description || descriptions[pathname] || descriptions['/']
        const img = image ? (image.startsWith('http') ? image : `${SITE}${image}`) : DEFAULT_IMAGE
        const url = `${SITE}${pathname}`

        document.title = full
        setMeta('meta[name="description"]', 'name', 'description', desc)
        setMeta('meta[property="og:title"]', 'property', 'og:title', full)
        setMeta('meta[property="og:description"]', 'property', 'og:description', desc)
        setMeta('meta[property="og:url"]', 'property', 'og:url', url)
        setMeta('meta[property="og:image"]', 'property', 'og:image', img)
        setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', full)
        setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', desc)
        setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', img)

        let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
        if (!canonical) {
            canonical = document.createElement('link')
            canonical.rel = 'canonical'
            document.head.append(canonical)
        }
        canonical.href = url

        let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]')
        if (!robots) {
            robots = document.createElement('meta')
            robots.name = 'robots'
            document.head.append(robots)
        }
        const privatePath = /^\/(admin|dashboard|certificate|reset-password|login|register)(\/|$)|\/player$/.test(
            pathname,
        )
        robots.content = noindex || privatePath ? 'noindex, nofollow' : 'index, follow'
    }, [pathname, title, description, image, noindex])
    return null
}
