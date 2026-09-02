import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'

const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
}

const styles = {
    success: 'bg-white border-brass-400/50 text-ink-900',
    error: 'bg-white border-red-200 text-ink-900',
    info: 'bg-white border-ivory-300 text-ink-900',
}

const iconStyles = {
    success: 'text-green-600',
    error: 'text-red-600',
    info: 'text-wine-700',
}

export function Toast() {
    const { toasts, dismissToast } = useUIStore()

    useEffect(() => {
        if (toasts.length === 0) return
        const timers = toasts.map((_, i) =>
            setTimeout(() => dismissToast(i), 4000)
        )
        return () => timers.forEach(clearTimeout)
    }, [toasts, dismissToast])

    return (
        <div
            aria-live="polite"
            className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm"
        >
            <AnimatePresence>
                {toasts.map((toast, i) => {
                    const Icon = icons[toast.type]
                    return (
                        <motion.div
                            key={`${i}-${toast.message}`}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            className={`flex items-start gap-3 border rounded-xl shadow-lift px-4 py-3 ${styles[toast.type]}`}
                        >
                            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconStyles[toast.type]}`} aria-hidden />
                            <p className="text-sm flex-1">{toast.message}</p>
                            <button
                                onClick={() => dismissToast(i)}
                                className="text-ink-400 hover:text-ink-700 cursor-pointer"
                                aria-label="Chiudi notifica"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    )
                })}
            </AnimatePresence>
        </div>
    )
}