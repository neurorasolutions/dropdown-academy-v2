import { useState } from 'react'
import { getMessages, dateTime } from '@/lib/admin'
import { supabase } from '@/lib/supabase'
import { useAsyncData } from '@/hooks/useAsyncData'
import { DataState } from '@/components/common/DataState'
import { useUIStore } from '@/store/uiStore'
import type { ContactMessage } from '@/types/database'
const labels = { unread: 'Da leggere', read: 'Letto', replied: 'Risposto' }
export default function AdminMessages() {
    const { data, loading, error, reload } = useAsyncData(getMessages)
    const [filter, setFilter] = useState('all')
    const [busy, setBusy] = useState<string | null>(null)
    async function changeStatus(id: string, status: ContactMessage['status']) {
        setBusy(id)
        try {
            const { error } = await supabase
                .from('dropdown_contact_messages')
                .update({ status })
                .eq('id', id)
                .select('id')
                .single()
            if (error) throw error
            reload()
        } catch {
            useUIStore.getState().showToast({ type: 'error', message: 'Modifica non salvata. Riprova.' })
        } finally {
            setBusy(null)
        }
    }
    const rows = (data || []).filter((m) => filter === 'all' || m.status === filter)
    return (
        <div className="space-y-6">
            <h2 className="font-serif text-2xl">Messaggi</h2>
            <select
                aria-label="Filtra messaggi"
                className="input-field"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            >
                <option value="all">Tutti i messaggi</option>
                {Object.entries(labels).map(([v, l]) => (
                    <option value={v} key={v}>
                        {l}
                    </option>
                ))}
            </select>
            <DataState loading={loading} error={error} retry={reload} />
            {!loading &&
                !error &&
                rows.map((m) => (
                    <article key={m.id} className="card p-6 space-y-4">
                        <div className="flex flex-wrap justify-between gap-3">
                            <div>
                                <h3 className="font-serif text-xl">{m.subject}</h3>
                                <p className="text-sm text-ink-500">
                                    {m.name} · {m.email} · {dateTime(m.created_at)}
                                </p>
                            </div>
                            <select
                                aria-label={`Stato messaggio: ${m.subject}`}
                                className="input-field sm:w-auto"
                                value={m.status}
                                disabled={busy === m.id}
                                onChange={(e) =>
                                    changeStatus(m.id, e.target.value as ContactMessage['status'])
                                }
                            >
                                {Object.entries(labels).map(([v, l]) => (
                                    <option key={v} value={v}>
                                        {l}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <p className="whitespace-pre-wrap break-words">{m.message}</p>
                    </article>
                ))}
            {!loading && !error && !rows.length && (
                <p className="card p-8 text-center">Nessun messaggio trovato.</p>
            )}
        </div>
    )
}
