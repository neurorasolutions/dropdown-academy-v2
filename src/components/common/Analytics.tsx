import { useEffect, useState } from 'react'
import { useCookieStore } from '@/store/cookieStore'

const GA_ID = import.meta.env.VITE_GA_ID

declare global {
    interface Window {
        dataLayer?: unknown[]
        gtag?: (...args: unknown[]) => void
    }
}

/**
 * Carica Google Analytics SOLO dopo il consenso ai cookie di analisi (GDPR).
 * Prima del consenso nessuno script di Google viene inserito nella pagina.
 */
export function Analytics() {
    const consent = useCookieStore((s) => s.consent)
    const analyticsAllowed = consent?.analytics === true
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        if (!GA_ID || !analyticsAllowed || loaded || window.gtag) return
        window.dataLayer = window.dataLayer || []
        window.gtag = function gtag(...args: unknown[]) {
            window.dataLayer!.push(args)
        }
        window.gtag('js', new Date())
        window.gtag('config', GA_ID, { anonymize_ip: true })
        const script = document.createElement('script')
        script.async = true
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
        document.head.appendChild(script)
        setLoaded(true)
    }, [analyticsAllowed, loaded])

    return null
}
