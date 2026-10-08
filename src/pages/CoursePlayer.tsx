import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, Circle, PlayCircle } from 'lucide-react'
import { getCourse } from '@/lib/catalog'
import { getPurchasedCourseSlugs, getCompletedLessons, toggleLessonCompletion } from '@/lib/purchases'
import { supabase, isDemoMode } from '@/lib/supabase'
import { videoSource, safeUrl } from '@/lib/media'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { useAsyncData } from '@/hooks/useAsyncData'
import { DataState } from '@/components/common/DataState'
type Media = { id: string; video_id: string | null; resources: unknown }
export default function CoursePlayer() {
    const { slug } = useParams()
    const { user } = useAuthStore()
    const loader = useCallback(async () => {
        const [course, purchases, completed] = await Promise.all([
            getCourse(slug || ''),
            getPurchasedCourseSlugs(user!.id),
            getCompletedLessons(user!.id, slug || ''),
        ])
        const purchased = purchases.includes(slug || '')
        let media: Media[] = []
        if (!isDemoMode && course) {
            const { data, error } = await supabase.rpc('dropdown_lesson_media', { p_course_id: course.id })
            if (error) throw error
            media = (data || []) as Media[]
        }
        return { course, purchased, completed, media }
    }, [slug, user])
    const { data, loading, error, reload } = useAsyncData(loader)
    const [selected, setSelected] = useState<string | null>(null)
    const [completed, setCompleted] = useState<string[]>([])
    const [busy, setBusy] = useState(false)
    useEffect(() => {
        setSelected(null)
        setCompleted(data?.completed || [])
    }, [data])
    if (loading || error)
        return (
            <div className="container-site py-12">
                <DataState loading={loading} error={error} retry={reload} />
            </div>
        )
    if (!data?.course)
        return (
            <div className="container-site py-16">
                <h1 className="section-title">Corso non trovato</h1>
                <Link to="/courses" className="btn-primary mt-6">
                    Torna ai corsi
                </Link>
            </div>
        )
    const { course, purchased, media } = data
    const lessons = course.modules.flatMap((m) => m.lessons)
    const active =
        lessons.find((l) => l.id === selected) ||
        lessons.find((l) => (purchased || l.isFree) && !completed.includes(l.id)) ||
        lessons[0]
    const allowed = purchased || active?.isFree
    const activeMedia = media.find((m) => m.id === active?.id)
    const source = allowed ? videoSource(activeMedia?.video_id || active?.videoUrl || '') : null
    const done = lessons.filter((l) => completed.includes(l.id)).length
    const percent = lessons.length ? Math.round((done / lessons.length) * 100) : 0
    const resources = Array.isArray(activeMedia?.resources)
        ? activeMedia.resources.filter(
              (r): r is { title: string; url: string } =>
                  !!r &&
                  typeof r === 'object' &&
                  typeof r.title === 'string' &&
                  typeof r.url === 'string' &&
                  !!safeUrl(r.url),
          )
        : []
    async function toggle() {
        if (!active || !user || !slug || busy) return
        setBusy(true)
        const value = !completed.includes(active.id)
        try {
            const ok = await toggleLessonCompletion(user.id, slug, active.id, value)
            if (!ok) throw new Error()
            setCompleted((prev) => (value ? [...prev, active.id] : prev.filter((id) => id !== active.id)))
        } catch {
            useUIStore.getState().showToast({ type: 'error', message: 'Progresso non salvato. Riprova.' })
        } finally {
            setBusy(false)
        }
    }
    return (
        <div className="container-site py-10 space-y-8">
            <Link to={`/courses/${slug}`} className="text-wine-700">
                ← Dettaglio corso
            </Link>
            <div className="flex flex-wrap justify-between gap-4">
                <h1 className="font-serif text-3xl">{course.title}</h1>
                <p className="text-ink-500">
                    {done} / {lessons.length} lezioni · {percent}%
                </p>
            </div>
            <progress
                className="w-full h-2 accent-wine-700"
                value={done}
                max={lessons.length || 1}
                aria-label="Progresso del corso"
            />
            {!purchased && (
                <div className="card p-5 flex flex-wrap justify-between gap-3">
                    <p>Stai guardando le anteprime gratuite.</p>
                    <Link className="text-wine-700 underline" to={`/courses/${slug}`}>
                        Acquista il corso completo
                    </Link>
                </div>
            )}
            {purchased && done === lessons.length && done > 0 && (
                <Link className="btn-primary" to={`/certificate/${slug}`}>
                    Visualizza attestato di completamento
                </Link>
            )}
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 min-w-0">
                    <div className="aspect-video bg-wine-950 rounded-2xl overflow-hidden flex items-center justify-center">
                        {source ? (
                            source.kind === 'video' ? (
                                <video
                                    key={source.url}
                                    className="w-full h-full"
                                    controls
                                    controlsList="nodownload"
                                    src={source.url}
                                />
                            ) : (
                                <iframe
                                    key={source.url}
                                    src={source.url}
                                    title={active?.title}
                                    className="w-full h-full"
                                    allow="fullscreen; picture-in-picture; encrypted-media"
                                    allowFullScreen
                                />
                            )
                        ) : (
                            <div className="text-center text-ivory-100 p-6">
                                <PlayCircle className="w-12 h-12 mx-auto mb-4" />
                                <p>
                                    {!allowed
                                        ? 'Questa lezione è riservata a chi ha acquistato il corso.'
                                        : active
                                          ? 'Il video di questa lezione non è ancora disponibile.'
                                          : 'Il programma sarà disponibile a breve.'}
                                </p>
                            </div>
                        )}
                    </div>
                    {active && (
                        <div className="mt-5 flex flex-col sm:flex-row gap-4 justify-between">
                            <div>
                                <h2 className="font-serif text-xl">{active.title}</h2>
                                <p className="text-sm text-ink-500">Durata: {active.duration}</p>
                            </div>
                            {purchased && (
                                <button
                                    disabled={busy || !source}
                                    className="btn-secondary"
                                    aria-pressed={completed.includes(active.id)}
                                    onClick={toggle}
                                >
                                    {busy
                                        ? 'Salvataggio…'
                                        : completed.includes(active.id)
                                          ? 'Completata ✓'
                                          : 'Segna come completata'}
                                </button>
                            )}
                        </div>
                    )}
                    {!!resources.length && (
                        <div className="card p-5 mt-6 space-y-3">
                            <h3 className="font-serif text-xl">Materiali della lezione</h3>
                            {resources.map((r) => (
                                <a
                                    key={r.url}
                                    className="block text-wine-700 underline"
                                    href={r.url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {r.title} ↗
                                </a>
                            ))}
                        </div>
                    )}
                    <div className="mt-6 flex justify-between gap-3">
                        <button
                            className="btn-secondary"
                            disabled={!active || lessons.indexOf(active) === 0}
                            onClick={() => setSelected(lessons[lessons.indexOf(active) - 1].id)}
                        >
                            ← Precedente
                        </button>
                        <button
                            className="btn-secondary"
                            disabled={!active || lessons.indexOf(active) >= lessons.length - 1}
                            onClick={() => setSelected(lessons[lessons.indexOf(active) + 1].id)}
                        >
                            Successiva →
                        </button>
                    </div>
                </div>
                <aside className="card h-fit divide-y divide-ivory-200">
                    {course.modules.map((m) => (
                        <section key={m.id} className="py-4">
                            <h3 className="px-5 text-sm font-semibold mb-2">{m.title}</h3>
                            {m.lessons.map((l) => (
                                <button
                                    key={l.id}
                                    onClick={() => setSelected(l.id)}
                                    aria-current={l.id === active?.id ? 'true' : undefined}
                                    className={`w-full text-left p-4 flex gap-3 items-center ${l.id === active?.id ? 'bg-wine-700/10 text-wine-700' : ''}`}
                                >
                                    {completed.includes(l.id) ? (
                                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                                    ) : (
                                        <Circle className="w-4 h-4 shrink-0" />
                                    )}
                                    <span className="flex-1 text-sm">
                                        {l.title}
                                        {l.isFree && (
                                            <small className="block text-ink-500">Anteprima gratuita</small>
                                        )}
                                    </span>
                                </button>
                            ))}
                        </section>
                    ))}
                </aside>
            </div>
        </div>
    )
}
