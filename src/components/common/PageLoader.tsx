import { Loader2 } from 'lucide-react'
export function PageLoader() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center" role="status">
            <Loader2 className="w-8 h-8 text-wine-700 animate-spin" aria-hidden />
            <span className="sr-only">Caricamento</span>
        </div>
    )
}
