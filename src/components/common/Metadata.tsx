import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
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
export function Metadata() {
    const { pathname } = useLocation()
    useEffect(() => {
        document.title = `${titles[pathname] || 'Formazione musicale'} | Dropdown Academy`
        let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
        if (!canonical) {
            canonical = document.createElement('link')
            canonical.rel = 'canonical'
            document.head.append(canonical)
        }
        canonical.href = `https://www.dropdownacademy.com${pathname}`
        let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
        if (!robots) {
            robots = document.createElement('meta')
            robots.name = 'robots'
            document.head.append(robots)
        }
        robots.content =
            /^\/(admin|dashboard|certificate|reset-password|login|register)(\/|$)|\/player$/.test(pathname)
                ? 'noindex, nofollow'
                : 'index, follow'
    }, [pathname])
    return null
}
