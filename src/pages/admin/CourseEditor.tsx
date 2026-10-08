import { useCallback, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAsyncData } from '@/hooks/useAsyncData'
import { DataState } from '@/components/common/DataState'
import { safeUrl, videoSource } from '@/lib/media'
import type { Course, CourseModule, Lesson } from '@/types/database'
import type { Json } from '@/types/database'
import { useUIStore } from '@/store/uiStore'
type Tree = Course & { dropdown_course_modules: (CourseModule & { dropdown_lessons: Lesson[] })[] }
const blank = {
    title: '',
    slug: '',
    description: '',
    price: 0,
    thumbnail_url: '',
    category: 'altro' as Course['category'],
    level: 'beginner' as Course['level'],
}
export default function CourseEditor() {
    const { id } = useParams()
    const navigate = useNavigate()
    const loader = useCallback(async () => {
        if (id === 'new') return null
        const { data, error } = await supabase
            .from('dropdown_courses')
            .select(
                '*,dropdown_course_modules(*,dropdown_lessons(id,module_id,title,description,video_duration,order_index,is_free,created_at))',
            )
            .eq('id', id!)
            .single()
        if (error) throw error
        const { data: media, error: mediaError } = await supabase.rpc('dropdown_lesson_media', {
            p_course_id: id!,
        })
        if (mediaError) throw mediaError
        const tree = data as unknown as Tree
        tree.dropdown_course_modules.forEach((m) =>
            m.dropdown_lessons.forEach((l) => {
                const item = media?.find((v) => v.id === l.id)
                l.video_id = item?.video_id || null
                l.resources = item?.resources || null
            }),
        )
        return tree
    }, [id])
    const { data, loading, error, reload } = useAsyncData(loader)
    return (
        <div className="space-y-6">
            <Link to="/admin/courses" className="text-wine-700">
                ← Tutti i corsi
            </Link>
            <DataState loading={loading} error={error} retry={reload} />
            {!loading && !error && (
                <Editor
                    key={id}
                    course={data}
                    onSaved={(saved) => {
                        if (id === 'new') navigate(`/admin/courses/${saved}`, { replace: true })
                        else reload()
                    }}
                />
            )}
        </div>
    )
}
function Editor({ course, onSaved }: { course: Tree | null; onSaved: (id: string) => void }) {
    const [form, setForm] = useState(
        course
            ? {
                  title: course.title,
                  slug: course.slug,
                  description: course.description,
                  price: course.price,
                  thumbnail_url: course.thumbnail_url || '',
                  category: course.category,
                  level: course.level,
              }
            : blank,
    )
    const [busy, setBusy] = useState(false)
    const [message, setMessage] = useState('')
    const [moduleName, setModuleName] = useState('')
    async function save(e: FormEvent) {
        e.preventDefault()
        setBusy(true)
        setMessage('')
        try {
            if (form.thumbnail_url && !safeUrl(form.thumbnail_url) && !/^\/(?!\/)/.test(form.thumbnail_url))
                throw new Error('Immagine non valida: usa HTTPS o un percorso locale.')
            const row = {
                ...form,
                title: form.title.trim(),
                thumbnail_url: form.thumbnail_url || null,
                updated_at: new Date().toISOString(),
            }
            const result = course
                ? await supabase
                      .from('dropdown_courses')
                      .update(row)
                      .eq('id', course.id)
                      .select('id')
                      .single()
                : await supabase
                      .from('dropdown_courses')
                      .insert({ ...row, is_published: false })
                      .select('id')
                      .single()
            if (result.error) throw result.error
            setMessage('Corso salvato.')
            onSaved(result.data.id)
        } catch {
            setMessage('Salvataggio non riuscito. Controlla i campi, lo slug univoco e i permessi.')
        } finally {
            setBusy(false)
        }
    }
    async function addModule(e: FormEvent) {
        e.preventDefault()
        if (!course) return
        setBusy(true)
        try {
            const { error } = await supabase
                .from('dropdown_course_modules')
                .insert({
                    course_id: course.id,
                    title: moduleName.trim(),
                    order_index:
                        Math.max(-1, ...course.dropdown_course_modules.map((m) => m.order_index)) + 1,
                })
            if (error) throw error
            setModuleName('')
            onSaved(course.id)
        } catch {
            setMessage('Modulo non salvato.')
        } finally {
            setBusy(false)
        }
    }
    return (
        <>
            <form onSubmit={save} className="card p-6 space-y-4">
                <h2 className="font-serif text-2xl">{course ? 'Modifica corso' : 'Nuovo corso'}</h2>
                {(['title', 'slug', 'thumbnail_url'] as const).map((key) => (
                    <label key={key} className="block text-sm font-medium">
                        {
                            {
                                title: 'Titolo',
                                slug: 'Indirizzo del corso (slug)',
                                thumbnail_url: 'Immagine',
                            }[key]
                        }
                        <input
                            className="input-field mt-1"
                            value={form[key]}
                            required={key !== 'thumbnail_url'}
                            pattern={key === 'slug' ? '[a-z0-9]+(-[a-z0-9]+)*' : undefined}
                            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        />
                    </label>
                ))}
                <label className="block text-sm font-medium">
                    Descrizione
                    <textarea
                        className="input-field mt-1"
                        rows={5}
                        required
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                </label>
                <div className="grid sm:grid-cols-3 gap-4">
                    <label className="block text-sm font-medium">
                        Prezzo (€)
                        <input
                            className="input-field mt-1"
                            type="number"
                            min="0.01"
                            step="0.01"
                            required
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                        />
                    </label>
                    <label className="block text-sm font-medium">
                        Categoria
                        <select
                            className="input-field mt-1"
                            value={form.category}
                            onChange={(e) =>
                                setForm({ ...form, category: e.target.value as Course['category'] })
                            }
                        >
                            {['modulare', 'ableton', 'serum', 'max-msp', 'pigments', 'altro'].map((c) => (
                                <option key={c}>{c}</option>
                            ))}
                        </select>
                    </label>
                    <label className="block text-sm font-medium">
                        Livello
                        <select
                            className="input-field mt-1"
                            value={form.level}
                            onChange={(e) => setForm({ ...form, level: e.target.value as Course['level'] })}
                        >
                            <option value="beginner">Principiante</option>
                            <option value="intermediate">Intermedio</option>
                            <option value="advanced">Avanzato</option>
                        </select>
                    </label>
                </div>
                <button disabled={busy} className="btn-primary">
                    Salva corso
                </button>
                <p role="status">{message}</p>
            </form>
            {course && (
                <>
                    <h2 className="font-serif text-2xl">Programma e video</h2>
                    {[...course.dropdown_course_modules]
                        .sort((a, b) => a.order_index - b.order_index)
                        .map((m) => (
                            <section key={m.id} className="card p-6 space-y-4">
                                <h3 className="font-serif text-xl">{m.title}</h3>
                                {[...m.dropdown_lessons]
                                    .sort((a, b) => a.order_index - b.order_index)
                                    .map((l) => (
                                        <LessonForm
                                            key={l.id}
                                            lesson={l}
                                            moduleId={m.id}
                                            order={l.order_index}
                                            saved={() => onSaved(course.id)}
                                        />
                                    ))}
                                <LessonForm
                                    moduleId={m.id}
                                    order={Math.max(-1, ...m.dropdown_lessons.map((l) => l.order_index)) + 1}
                                    saved={() => onSaved(course.id)}
                                />
                            </section>
                        ))}
                    <form onSubmit={addModule} className="card p-6 flex flex-wrap gap-3">
                        <input
                            className="input-field flex-1"
                            required
                            aria-label="Titolo nuovo modulo"
                            placeholder="Titolo del nuovo modulo"
                            value={moduleName}
                            onChange={(e) => setModuleName(e.target.value)}
                        />
                        <button className="btn-primary" disabled={busy}>
                            Aggiungi modulo
                        </button>
                    </form>
                </>
            )}
        </>
    )
}
function LessonForm({
    lesson,
    moduleId,
    order,
    saved,
}: {
    lesson?: Lesson
    moduleId: string
    order: number
    saved: () => void
}) {
    const [open, setOpen] = useState(false)
    const [busy, setBusy] = useState(false)
    async function save(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const form = new FormData(e.currentTarget)
        const resources = String(form.get('resources') || '')
            .split('\n')
            .filter((line) => line.trim())
            .map((line) => {
                const split = line.indexOf('|')
                return { title: line.slice(0, split).trim(), url: line.slice(split + 1).trim() }
            })
        if (resources.some((r) => !r.title || !safeUrl(r.url))) {
            useUIStore
                .getState()
                .showToast({
                    type: 'error',
                    message: 'Materiali: usa una riga per file, nel formato Titolo | link HTTPS.',
                })
            return
        }
        const video = String(form.get('video') || '').trim()
        if (video && !videoSource(video)) {
            useUIStore
                .getState()
                .showToast({
                    type: 'error',
                    message: 'Usa un link YouTube, Vimeo, Google Drive o un file MP4/WebM HTTPS.',
                })
            return
        }
        setBusy(true)
        try {
            const row = {
                resources: resources as Json,
                module_id: moduleId,
                title: String(form.get('title')).trim(),
                video_id: video || null,
                video_duration: Number(form.get('duration')),
                order_index: Number(form.get('order')),
                is_free: form.get('free') === 'on',
                description: String(form.get('description') || ''),
            }
            const result = lesson
                ? await supabase
                      .from('dropdown_lessons')
                      .update(row)
                      .eq('id', lesson.id)
                      .select('id')
                      .single()
                : await supabase.from('dropdown_lessons').insert(row).select('id').single()
            if (result.error) throw result.error
            saved()
            setOpen(false)
        } catch {
            useUIStore.getState().showToast({ type: 'error', message: 'Lezione non salvata.' })
        } finally {
            setBusy(false)
        }
    }
    return (
        <div className="border-t border-ivory-200 pt-4">
            <button
                className="text-left w-full py-2 text-wine-700"
                aria-expanded={open}
                onClick={() => setOpen(!open)}
            >
                {lesson
                    ? `${lesson.title} · ${lesson.video_id ? 'Video collegato' : 'Video mancante'}`
                    : '+ Aggiungi lezione'}
            </button>
            {open && (
                <form onSubmit={save} className="space-y-3 mt-3">
                    <label className="block text-sm">
                        Titolo
                        <input className="input-field" name="title" required defaultValue={lesson?.title} />
                    </label>
                    <label className="block text-sm">
                        Video
                        <input
                            className="input-field"
                            name="video"
                            defaultValue={lesson?.video_id || ''}
                            placeholder="https://…"
                        />
                    </label>
                    <label className="block text-sm">
                        Descrizione
                        <textarea
                            className="input-field"
                            name="description"
                            defaultValue={lesson?.description || ''}
                        />
                    </label>
                    <label className="block text-sm">
                        Materiali (una riga per file: Titolo | link HTTPS)
                        <textarea
                            name="resources"
                            className="input-field"
                            rows={3}
                            defaultValue={
                                Array.isArray(lesson?.resources)
                                    ? lesson.resources
                                          .map((r) =>
                                              r && typeof r === 'object' && !Array.isArray(r)
                                                  ? `${r.title || ''} | ${r.url || ''}`
                                                  : '',
                                          )
                                          .join('\n')
                                    : ''
                            }
                        />
                    </label>
                    <div className="grid sm:grid-cols-2 gap-3">
                        <label className="block text-sm">
                            Durata (minuti)
                            <input
                                className="input-field"
                                type="number"
                                name="duration"
                                min="0"
                                step="0.01"
                                defaultValue={lesson?.video_duration || 0}
                            />
                        </label>
                        <label className="block text-sm">
                            Ordine
                            <input
                                className="input-field"
                                type="number"
                                name="order"
                                min="0"
                                step="1"
                                defaultValue={order}
                            />
                        </label>
                    </div>
                    <label className="flex gap-2 items-center py-2">
                        <input type="checkbox" name="free" defaultChecked={lesson?.is_free} />
                        Anteprima gratuita
                    </label>
                    <button className="btn-primary" disabled={busy}>
                        Salva lezione
                    </button>
                </form>
            )}
        </div>
    )
}
