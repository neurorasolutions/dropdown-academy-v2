import { Mail } from 'lucide-react'

export default function AdminMessages() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 text-ink-400">
                <Mail className="w-5 h-5" aria-hidden />
                <p className="text-sm">
                    Messaggi dalla tabella <code className="text-xs bg-ivory-200 px-1.5 py-0.5 rounded">contact_messages</code>.
                </p>
            </div>
            <div className="card p-12 text-center">
                <p className="text-ink-500">
                    Collega Supabase per leggere e gestire i messaggi ricevuti dal form di contatto.
                </p>
            </div>
        </div>
    )
}