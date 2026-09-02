import { type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
    children: ReactNode
    requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
    const { user, profile, isInitialized } = useAuthStore()
    const location = useLocation()

    if (!isInitialized) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-wine-700 animate-spin" aria-label="Caricamento" />
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />
    }

    if (requireAdmin && !profile?.is_admin) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="font-serif text-2xl mb-2">Accesso riservato</h1>
                    <p className="text-ink-500">Questa area è riservata agli amministratori.</p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}