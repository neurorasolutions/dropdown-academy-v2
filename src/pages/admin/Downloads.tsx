import { useState, type FormEvent } from 'react'
import { getDownloads } from '@/lib/catalog'
import { supabase } from '@/lib/supabase'
import { safeUrl } from '@/lib/media'
import { useAsyncData } from '@/hooks/useAsyncData'
import { DataState } from '@/components/common/DataState'
import type { FreeDownload } from '@/types/database'
const empty = {
    title: '',
    description: '',
    file_url: '',
    file_type: 'preset' as FreeDownload['file_type'],
    thumbnail_url: '',
}
export default function AdminDownloads() {
    const { data, loading, error, reload } = useAsyncData(getDownloads)
    const [form, setForm] = useState(empty)
    const [editing, setEditing] = useState<string | null>(null)
    const [busy, setBusy] = useState(false)
    const [feedback, setFeedback] = useState('')
    const [removing, setRemoving] = useState<string | null>(null)
    async function save(e: FormEvent) {
        e.preventDefault()
        setFeedback('')
        if (
            !safeUrl(form.file_url) ||
            (form.thumbnail_url && !safeUrl(form.thumbnail_url) && !/^\/(?!\/)/.test(form.thumbnail_url))
        ) {
            setFeedback('Inserisci un link HTTPS valido.')
            return
        }
        setBusy(true)
        try {
            const row = { ...form, title: form.title.trim(), thumbnail_url: form.thumbnail_url || null }
            const result = editing
                ? await supabase
                      .from('dropdown_free_downloads')
                      .update(row)
                      .eq('id', editing)
                      .select('id')
                      .single()
                : await supabase.from('dropdown_free_downloads').insert(row).select('id').single()
            if (result.error) throw result.error
            setForm(empty)
            setEditing(null)
            setFeedback('Risorsa salvata.')
            reload()
        } catch {
            setFeedback('Salvataggio non riuscito. Verifica i permessi e riprova.')
        } finally {
            setBusy(false)
        }
    }
    async function remove(id: string) {
        setBusy(true)
        try {
            const { error } = await supabase
                .from('dropdown_free_downloads')
                .delete()
                .eq('id', id)
                .select('id')
                .single()
            if (error) throw error
            setRemoving(null)
            reload()
        } catch {
            setFeedback('Eliminazione non riuscita.')
        } finally {
            setBusy(false)
        }
    }
    return (
        <div className="space-y-6">
            <h2 className="font-serif text-2xl">Risorse scaricabili</h2>
            <form className="card p-6 space-y-4" onSubmit={save}>
                <h3 className="font-serif text-xl">{editing ? 'Modifica risorsa' : 'Nuova risorsa'}</h3>
                {(['title', 'description', 'file_url', 'thumbnail_url'] as const).map((key) => (
                    <label key={key} className="block text-sm font-medium">
                        {
                            {
                                title: 'Titolo',
                                description: 'Descrizione',
                                file_url: 'Link al file (HTTPS)',
                                thumbnail_url: 'Immagine (facoltativa)',
                            }[key]
                        }
                        <input
                            className="input-field mt-1"
                            required={key === 'title' || key === 'file_url'}
                            value={form[key]}
                            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        />
                    </label>
                ))}
                <label className="block text-sm font-medium">
                    Tipo
                    <select
                        className="input-field mt-1"
                        value={form.file_type}
                        onChange={(e) =>
                            setForm({ ...form, file_type: e.target.value as FreeDownload['file_type'] })
                        }
                    >
                        <option value="preset">Preset</option>
                        <option value="sample-pack">Sample pack</option>
                        <option value="template">Template / guida</option>
                    </select>
                </label>
                <div className="flex gap-3">
                    <button disabled={busy} className="btn-primary">
                        {busy ? 'Salvataggio…' : 'Salva risorsa'}
                    </button>
                    {editing && (
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => {
                                setEditing(null)
                                setForm(empty)
                            }}
                        >
                            Annulla
                        </button>
                    )}
                </div>
                <p role="status">{feedback}</p>
            </form>
            <DataState loading={loading} error={error} retry={reload} />
            {!loading &&
                !error &&
                (data || []).map((item) => (
                    <article className="card p-5 flex flex-wrap justify-between gap-4" key={item.id}>
                        <div>
                            <h3 className="font-medium">{item.title}</h3>
                            <p className="text-sm text-ink-500">{item.file_type}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                className="btn-secondary"
                                onClick={() => {
                                    setEditing(item.id)
                                    setForm({
                                        title: item.title,
                                        description: item.description || '',
                                        file_url: item.file_url,
                                        file_type: item.file_type,
                                        thumbnail_url: item.thumbnail_url || '',
                                    })
                                    window.scrollTo(0, 0)
                                }}
                            >
                                Modifica
                            </button>
                            {removing === item.id ? (
                                <>
                                    <button
                                        className="btn-primary"
                                        disabled={busy}
                                        onClick={() => remove(item.id)}
                                    >
                                        Conferma eliminazione
                                    </button>
                                    <button className="btn-secondary" onClick={() => setRemoving(null)}>
                                        Annulla
                                    </button>
                                </>
                            ) : (
                                <button className="btn-secondary" onClick={() => setRemoving(item.id)}>
                                    Elimina
                                </button>
                            )}
                        </div>
                    </article>
                ))}
            {!loading && !error && !data?.length && <p>Nessuna risorsa pubblicata.</p>}
        </div>
    )
}
