import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, CheckCircle2, Circle, PlayCircle, Lock } from 'lucide-react'
import { coursesData } from '@/data/courses'
import { useAuthStore } from '@/store/authStore'
import { getPurchasedCourseSlugs, getCompletedLessons, toggleLessonCompletion } from '@/lib/purchases'
import { supabase, isDemoMode } from '@/lib/supabase'

interface PlayerLesson {
    id: string
    title: string
    duration: string
    videoUrl: string
    isFree: boolean
    orderIndex: number
}

interface PlayerModule {
    id: string
    title: string
    orderIndex: number
    lessons: PlayerLesson[]
}

interface PlayerCourse {
    slug: string
    title: string
    modules: PlayerModule[]
}

export default function CoursePlayer() {
    const { slug } = useParams()
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const [isLoading, setIsLoading] = useState(true)
    const [isPurchased, setIsPurchased] = useState(false)
    const [completedLessons, setCompletedLessons] = useState<string[]>([])
    const [course, setCourse] = useState<PlayerCourse | null>(
        slug
            ? {
                  slug,
                  title: coursesData[slug]?.title || '',
                  modules: (coursesData[slug]?.modules || []) as unknown as PlayerModule[],
              }
            : null
    )
    const [activeLesson, setActiveLesson] = useState<PlayerLesson | null>(null)
    const playerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        async function checkAccess() {
            if (!user) {
                navigate('/login')
                return
            }
            if (slug) {
                if (!isDemoMode) {
                    try {
                        const { data, error } = await (supabase.from('dropdown_courses') as any)
                            .select('*, dropdown_course_modules(*, dropdown_lessons(*))')
                            .eq('slug', slug)
                            .single()

                        if (data && !error) {
                            const sortedModules = (data.dropdown_course_modules || [])
                                .map((m: any) => ({
                                    id: m.id,
                                    title: m.title,
                                    orderIndex: m.order_index,
                                    lessons: (m.dropdown_lessons || [])
                                        .map((l: any) => ({
                                            id: l.id,
                                            title: l.title,
                                            duration: l.video_duration
                                                ? `${Math.floor(l.video_duration / 60)}:${String(Math.floor(l.video_duration % 60)).padStart(2, '0')}`
                                                : '0:00',
                                            videoUrl: l.video_id || '',
                                            isFree: l.is_free,
                                            orderIndex: l.order_index,
                                        }))
                                        .sort((a: any, b: any) => a.orderIndex - b.orderIndex),
                                }))
                                .sort((a: any, b: any) => a.orderIndex - b.orderIndex)

                            setCourse({ slug: data.slug, title: data.title, modules: sortedModules })
                        }
                    } catch (err) {
                        console.error('Error fetching course in player:', err)
                    }
                }

                try {
                    const purchasedSlugs = await getPurchasedCourseSlugs(user.id)
                    if (purchasedSlugs.includes(slug)) {
                        setIsPurchased(true)
                        const completed = await getCompletedLessons(user.id, slug)
                        setCompletedLessons(completed)
                    }
                } catch (e) {
                    console.error('Error loading course player progress:', e)
                }
            }
            setIsLoading(false)
        }
        checkAccess()
    }, [user, slug, navigate])

    const allLessons = course?.modules.flatMap((m) => m.lessons) || []
    const firstLesson = allLessons[0]

    useEffect(() => {
        if (!activeLesson && firstLesson && isPurchased) {
            setActiveLesson(firstLesson)
        }
    }, [activeLesson, firstLesson, isPurchased])

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-wine-700 border-t-transparent rounded-full animate-spin" role="status" aria-label="Caricamento" />
            </div>
        )
    }

    if (!course) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="font-serif text-3xl font-semibold mb-4">Corso non trovato</h1>
                    <Link to="/courses" className="btn-primary">Torna ai corsi</Link>
                </div>
            </div>
        )
    }

    if (!isPurchased) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center max-w-md">
                    <Lock className="w-10 h-10 text-ink-400 mx-auto mb-4" aria-hidden />
                    <h1 className="font-serif text-2xl font-semibold mb-2">Corso non acquistato</h1>
                    <p className="text-ink-500 mb-6">
                        Per accedere a questo corso devi prima acquistarlo.
                    </p>
                    <Link to={`/courses/${slug}`} className="btn-primary">
                        Vai alla pagina del corso
                    </Link>
                </div>
            </div>
        )
    }

    const completedCount = allLessons.filter((l) => completedLessons.includes(l.id)).length
    const progress = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0

    const handleToggleComplete = async (lessonId: string) => {
        if (!user || !slug) return
        const isCompleted = completedLessons.includes(lessonId)
        setCompletedLessons((prev) =>
            isCompleted ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
        )
        await toggleLessonCompletion(user.id, slug, lessonId, !isCompleted)
    }

    return (
        <div className="bg-ivory-50 min-h-[calc(100dvh-4rem)]">
            <div className="container-site py-8 lg:py-12">
                {/* Header corso */}
                <div className="mb-8">
                    <Link
                        to={`/courses/${slug}`}
                        className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-wine-700 transition-colors mb-4"
                    >
                        <ChevronLeft className="w-4 h-4" aria-hidden />
                        Dettaglio corso
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h1 className="font-serif text-2xl lg:text-3xl font-semibold">{course.title}</h1>
                        <div className="flex items-center gap-3 min-w-0 md:w-64" aria-label={`Progresso: ${progress}%`}>
                            <div className="flex-1 h-2 bg-ivory-300 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-wine-700 rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                    role="progressbar"
                                    aria-valuenow={progress}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                />
                            </div>
                            <span className="text-sm text-ink-500 tabular-nums shrink-0">{progress}%</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Player */}
                    <div className="lg:col-span-2">
                        <div
                            ref={playerRef}
                            className="aspect-video bg-wine-950 rounded-2xl flex items-center justify-center overflow-hidden shadow-card"
                        >
                            {activeLesson?.videoUrl ? (
                                <iframe
                                    src={activeLesson.videoUrl}
                                    title={activeLesson.title}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <div className="text-center px-8">
                                    <PlayCircle className="w-14 h-14 text-ivory-200/30 mx-auto mb-4" aria-hidden />
                                    <p className="text-ivory-200/70 font-serif text-lg italic">
                                        {activeLesson?.title || 'Seleziona una lezione'}
                                    </p>
                                    <p className="text-sm text-ivory-200/40 mt-2">
                                        Il video sarà disponibile quando il contenuto verrà collegato.
                                    </p>
                                </div>
                            )}
                        </div>

                        {activeLesson && (
                            <motion.div
                                key={activeLesson.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 flex items-start justify-between gap-4"
                            >
                                <div>
                                    <h2 className="font-serif text-xl font-semibold">{activeLesson.title}</h2>
                                    <p className="text-sm text-ink-400 mt-1">
                                        Durata: {activeLesson.duration}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleToggleComplete(activeLesson.id)}
                                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 shrink-0 ${
                                        completedLessons.includes(activeLesson.id)
                                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                            : 'btn-secondary'
                                    }`}
                                    aria-pressed={completedLessons.includes(activeLesson.id)}
                                >
                                    {completedLessons.includes(activeLesson.id) ? (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" aria-hidden />
                                            Completata
                                        </>
                                    ) : (
                                        <>
                                            <Circle className="w-4 h-4" aria-hidden />
                                            Segna come completata
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        )}
                    </div>

                    {/* Lista lezioni */}
                    <aside>
                        <div className="card divide-y divide-ivory-300/40 sticky top-24 max-h-[calc(100dvh-8rem)] overflow-y-auto">
                            {course.modules.map((module) => (
                                <div key={module.id} className="py-4">
                                    <h3 className="px-5 pb-2 text-xs font-semibold tracking-widest2 uppercase text-brass-600">
                                        {module.title}
                                    </h3>
                                    <ul>
                                        {module.lessons.map((lesson) => {
                                            const isActive = activeLesson?.id === lesson.id
                                            const isDone = completedLessons.includes(lesson.id)
                                            return (
                                                <li key={lesson.id}>
                                                    <button
                                                        onClick={() => setActiveLesson(lesson)}
                                                        className={`w-full text-left px-5 py-3 flex items-center gap-3 cursor-pointer transition-colors hover:bg-ivory-50 ${
                                                            isActive ? 'bg-wine-700/5 border-l-2 border-wine-700' : 'border-l-2 border-transparent'
                                                        }`}
                                                        aria-current={isActive ? 'true' : undefined}
                                                    >
                                                        {isDone ? (
                                                            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" aria-hidden />
                                                        ) : (
                                                            <Circle className="w-4 h-4 text-ink-300 shrink-0" aria-hidden />
                                                        )}
                                                        <span className={`text-sm flex-1 ${isActive ? 'font-medium text-wine-700' : 'text-ink-700'}`}>
                                                            {lesson.title}
                                                        </span>
                                                        <span className="text-xs text-ink-400 tabular-nums shrink-0">
                                                            {lesson.duration}
                                                        </span>
                                                    </button>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}