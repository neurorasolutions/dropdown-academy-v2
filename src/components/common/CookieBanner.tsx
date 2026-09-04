import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X } from 'lucide-react'
import { useCookieStore } from '@/store/cookieStore'
import { Link } from 'react-router-dom'

export function CookieBanner() {
    const {
        consent,
        bannerOpen,
        preferencesOpen,
        showBanner,
        openPreferences,
        closePreferences,
        acceptAll,
        rejectOptional,
        savePreferences,
    } = useCookieStore()

    const [payments, setPayments] = useState(false)

    useEffect(() => {
        // Banner mostrato solo se l'utente non ha ancora deciso
        if (!consent?.decidedAt) {
            const t = setTimeout(() => showBanner(), 800)
            return () => clearTimeout(t)
        }
    }, [consent, showBanner])

    useEffect(() => {
        if (preferencesOpen) setPayments(consent?.payments ?? false)
    }, [preferencesOpen, consent])

    return (
        <>
            {/* Banner */}
            <AnimatePresence>
                {bannerOpen && !preferencesOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        transition={{ duration: 0.25 }}
                        className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50"
                        role="dialog"
                        aria-label="Preferenze cookie"
                    >
                        <div className="bg-white border border-ivory-300 rounded-2xl shadow-lift p-6">
                            <div className="flex items-start gap-3 mb-4">
                                <span className="w-10 h-10 rounded-full bg-brass-400/20 text-brass-600 flex items-center justify-center shrink-0">
                                    <Cookie className="w-5 h-5" aria-hidden />
                                </span>
                                <div>
                                    <h2 className="font-serif text-lg font-semibold">I tuoi cookie</h2>
                                    <p className="text-xs text-ink-500 leading-relaxed mt-1">
                                        Usiamo cookie tecnici per il funzionamento del sito (accesso ai corsi,
                                        carrello). Con il tuo consenso attiviamo anche i cookie dei servizi
                                        di pagamento. Dettagli nella{' '}
                                        <Link to="/cookies" className="text-wine-700 underline underline-offset-2">
                                            Cookie Policy
                                        </Link>
                                        .
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <button onClick={acceptAll} className="btn-primary flex-1 text-sm py-2.5 cursor-pointer">
                                    Accetta tutti
                                </button>
                                <button onClick={rejectOptional} className="btn-secondary flex-1 text-sm py-2.5 cursor-pointer">
                                    Solo necessari
                                </button>
                                <button
                                    onClick={openPreferences}
                                    className="text-sm text-ink-500 hover:text-wine-700 underline underline-offset-2 py-2.5 cursor-pointer"
                                >
                                    Personalizza
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Preferenze */}
            <AnimatePresence>
                {preferencesOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-wine-950/40 flex items-end sm:items-center justify-center p-4"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Preferenze cookie"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-lift max-w-lg w-full max-h-[85vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-ivory-300">
                                <h2 className="font-serif text-xl font-semibold">Preferenze cookie</h2>
                                <button
                                    onClick={closePreferences}
                                    className="p-2 text-ink-400 hover:text-ink-700 cursor-pointer"
                                    aria-label="Chiudi"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                {/* Necessari */}
                                <div className="border border-ivory-300 rounded-xl p-4">
                                    <div className="flex items-center justify-between gap-4 mb-2">
                                        <h3 className="font-medium">Cookie necessari</h3>
                                        <span className="text-xs px-2.5 py-1 rounded-full bg-ivory-200 text-ink-500">
                                            Sempre attivi
                                        </span>
                                    </div>
                                    <p className="text-sm text-ink-500 leading-relaxed">
                                        Sessione di accesso, sicurezza e funzionamento della piattaforma.
                                        Non possono essere disattivati.
                                    </p>
                                </div>

                                {/* Pagamenti */}
                                <div className="border border-ivory-300 rounded-xl p-4">
                                    <div className="flex items-center justify-between gap-4 mb-2">
                                        <h3 className="font-medium">Cookie di pagamento (PayPal)</h3>
                                        <button
                                            onClick={() => setPayments(!payments)}
                                            role="switch"
                                            aria-checked={payments}
                                            className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${
                                                payments ? 'bg-wine-700' : 'bg-ivory-300'
                                            }`}
                                            aria-label="Attiva cookie di pagamento"
                                        >
                                            <span
                                                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                                                    payments ? 'translate-x-5' : ''
                                                }`}
                                            />
                                        </button>
                                    </div>
                                    <p className="text-sm text-ink-500 leading-relaxed">
                                        Servono al gateway PayPal per elaborare i pagamenti in sicurezza.
                                        Se li disattivi, potrai comunque navigare e acquistare: ti verrà
                                        chiesto il consenso al momento del checkout.
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 pt-0 flex flex-col sm:flex-row gap-2">
                                <button onClick={() => savePreferences({ payments })} className="btn-primary flex-1 text-sm cursor-pointer">
                                    Salva preferenze
                                </button>
                                <button onClick={acceptAll} className="btn-secondary flex-1 text-sm cursor-pointer">
                                    Accetta tutti
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}