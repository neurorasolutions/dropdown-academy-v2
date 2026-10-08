import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getAdminCourses, money } from '@/lib/admin'
import { useAsyncData } from '@/hooks/useAsyncData'
import { DataState } from '@/components/common/DataState'
import { supabase } from '@/lib/supabase'
import { useUIStore } from '@/store/uiStore'
export default function AdminCourses() {
    const { data, loading, error, reload } = useAsyncData(getAdminCourses)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('all')
    const [busy, setBusy] = useState<string | null>(null)
    const rows = (data || []).filter(
        (c) =>
            c.title.toLowerCase().includes(search.toLowerCase()) &&
            (filter === 'all' || c.is_published === (filter === 'published')),
    )
    async function toggle(id: string, value: boolean) {
        setBusy(id)
        try {
            const { error } = await supabase
                .from('dropdown_courses')
                .update({ is_published: value, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select('id')
                .single()
            if (error) throw error
            reload()
        } catch {
            useUIStore.getState().showToast({ type: 'error', message: 'Stato non salvato. Riprova.' })
        } finally {
            setBusy(null)
        }
    }
    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between gap-3">
                <h2 className="font-serif text-2xl">Corsi</h2>
                <Link to="/admin/courses/new" className="btn-primary">
                    Nuovo corso
                </Link>
            </div>
            <div className="flex flex-wrap gap-3">
                <input
                    aria-label="Cerca corso"
                    className="input-field flex-1"
                    placeholder="Cerca corso…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    className="input-field sm:w-auto"
                    aria-label="Stato pubblicazione"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">Tutti</option>
                    <option value="published">Pubblicati</option>
                    <option value="draft">Bozze</option>
                </select>
            </div>
            <DataState loading={loading} error={error} retry={reload} />
            {!loading && !error && (
                <div className="card divide-y divide-ivory-200">
                    {rows.map((c) => (
                        <article key={c.id} className="p-5 flex flex-wrap justify-between gap-4">
                            <div>
                                <Link
                                    to={`/admin/courses/${c.id}`}
                                    className="font-serif text-xl hover:underline"
                                >
                                    {c.title}
                                </Link>
                                <p className="text-sm text-ink-500">
                                    {money(c.price)} · {c.category}
                                </p>
                            </div>
                            <div className="flex gap-3 items-center">
                                <button
                                    className="btn-secondary"
                                    disabled={busy === c.id}
                                    aria-pressed={c.is_published}
                                    onClick={() => toggle(c.id, !c.is_published)}
                                >
                                    {c.is_published ? 'Pubblicato' : 'Bozza'}
                                </button>
                                <Link to={`/admin/courses/${c.id}`} className="text-wine-700 underline">
                                    Modifica
                                </Link>
                            </div>
                        </article>
                    ))}
                    {!rows.length && <p className="p-8 text-center">Nessun corso trovato.</p>}
                </div>
            )}
        </div>
    )
}
