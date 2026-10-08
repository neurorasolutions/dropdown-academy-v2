import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

interface GoogleButtonProps {
    redirect?: string
    label?: string
}

function GoogleIcon() {
    return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden focusable="false">
            <path
                fill="#4285F4"
                d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.54-5.17 3.54-8.87z"
            />
            <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.94-2.91l-3.88-3c-1.08.72-2.45 1.16-4.06 1.16-3.12 0-5.77-2.1-6.71-4.96H1.28v3.09A12 12 0 0 0 12 24z"
            />
            <path
                fill="#FBBC05"
                d="M5.29 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.28a12 12 0 0 0 0 10.76l4.01-3.09z"
            />
            <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.62l4.01 3.09C6.23 6.85 8.88 4.75 12 4.75z"
            />
        </svg>
    )
}

export function GoogleButton({ redirect = '/dashboard', label = 'Continua con Google' }: GoogleButtonProps) {
    const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle)
    const [isLoading, setIsLoading] = useState(false)

    const handleClick = async () => {
        setIsLoading(true)
        const { error } = await signInWithGoogle(redirect)
        if (error) setIsLoading(false)
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-3 bg-white text-ink-900 font-medium
                       px-6 py-3 rounded-full border border-ivory-300 cursor-pointer transition-all duration-200
                       hover:border-wine-700/40 hover:bg-ivory-100 active:scale-[0.98]
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-600 focus-visible:ring-offset-2
                       disabled:opacity-60"
        >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden /> : <GoogleIcon />}
            {label}
        </button>
    )
}
