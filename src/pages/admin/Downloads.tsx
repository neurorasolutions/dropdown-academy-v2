import { Download } from 'lucide-react'

export default function AdminDownloads() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 text-ink-400">
                <Download className="w-5 h-5" aria-hidden />
                <p className="text-sm">
                    Gestione risorse collegata alla tabella <code className="text-xs bg-ivory-200 px-1.5 py-0.5 rounded">free_downloads</code>.
                </p>
            </div>
            <div className="card p-12 text-center">
                <p className="text-ink-500">
                    Collega Supabase per aggiungere, modificare e rimuovere le risorse scaricabili.
                </p>
            </div>
        </div>
    )
}