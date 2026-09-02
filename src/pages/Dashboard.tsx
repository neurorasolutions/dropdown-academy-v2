import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, PlayCircle, Download as DownloadIcon } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { getPurchasedCourseSlugs } from '@/lib/purchases'
import { coursesData } from '@/data/courses'

interface PurchasedCourse {
    slug: string
    title: string
    thumbnail: string
    lessonsCount: number
    duration: string
    progress: number
}

export default function Dashboard() {
    const { user, profile } = useAuthStore()
    const [courses, setCourses] = useState<PurchasedCourse[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function loadCourses() {
            if (!user) return
            try {
                const slugs = await getPurchasedCourseSlugs(user.id)
                const purchased: PurchasedCourse[] = slugs
                    .map((slug) => coursesData[slug])
                    .filter(Boolean)
                    .map((c) => ({
                        slug: c.slug,
                        title: c.title,
                        thumbnail: c.thumbnail,
                        lessonsCount: c.lessonsCount,
                        duration: c.duration,
                        progress: 0,
                    }))
                setCourses(purchased)
            } catch (e) {
                console.error('Error loading dashboard courses:', e)
            } finally {
                setIsLoading(false)
            }
        }
        loadCourses()
    }, [user])

    const firstName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Studente'

    return (
        <div className="container-site py-12 lg:py-20">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-14"
            >
                <p className="eyebrow mb-3">Area personale</p>
                <h1 className="font-serif text-3xl lg:text-4xl font-semibold">
                    Ciao, <span className="italic text-wine-700">{firstName}</span>
                </h1>
            </motion.div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="card overflow-hidden">
                            <div className="aspect-[4/3] bg-ivory-200 animate-pulse" />
                            <div className="p-6 space-y-3">
                                <div className="h-5 bg-ivory-200 rounded animate-pulse w-3/4" />
                                <div className="h-4 bg-ivory-200 rounded animate-pulse w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : courses.length === 0 ? (
                <div className="card p-12 text-center max-w-lg mx-auto">
                    <BookOpen className="w-12 h-12 text-ink-300 mx-auto mb-4" aria-hidden />
                    <h2 className="font-serif text-2xl font-semibold mb-2">
                        Nessun corso ancora
                    </h2>
                    <p className="text-ink-500 mb-6">
                        Quando acquisterai un corso lo troverai qui, pronto per essere iniziato.
                    </p>
                    <Link to="/courses" className="btn-primary">
                        Esplora il catalogo
                    </Link>
                </div>
            ) : (
                <div>
                    <h2 className="font-serif text-2xl font-semibold mb-6">I tuoi corsi</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course, i) => (
                            <motion.div
                                key={course.slug}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.06 }}
                            >
                                <Link to={`/courses/${course.slug}/player`} className="group block h-full">
                                    <article className="card h-full transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lift">
                                        <div className="aspect-[16/9] overflow-hidden bg-ivory-200 relative">
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                loading="lazy"
                                                className="w-full h-full object-cover"
                                                width={800}
                                                height={450}
                                            />
                                            <div className="absolute inset-0 bg-wine-950/0 group-hover:bg-wine-950/30 transition-colors duration-300 flex items-center justify-center">
                                                <PlayCircle className="w-12 h-12 text-ivory-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden />
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="font-serif text-lg font-semibold">{course.title}</h3>
                                            <p className="text-xs text-ink-400 mt-1 mb-4">
                                                {course.lessonsCount} lezioni · {course.duration}
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-1.5 bg-ivory-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-wine-700 rounded-full"
                                                        style={{ width: `${course.progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-ink-400 tabular-nums">
                                                    {course.progress}%
                                                </span>
                                            </div>
                                            <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-wine-700">
                                                Continua
                                                <span aria-hidden>→</span>
                                            </span>
                                        </div>
                                    </article>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                        <Link to="/courses" className="card p-5 flex items-center gap-4 hover:shadow-lift transition-all group">
                            <span className="w-11 h-11 rounded-full bg-wine-700/10 text-wine-700 flex items-center justify-center shrink-0">
                                <BookOpen className="w-5 h-5" aria-hidden />
                            </span>
                            <div>
                                <h3 className="font-medium">Catalogo completo</h3>
                                <p className="text-sm text-ink-500">Scopri i nuovi corsi</p>
                            </div>
                        </Link>
                        <Link to="/downloads" className="card p-5 flex items-center gap-4 hover:shadow-lift transition-all">
                            <span className="w-11 h-11 rounded-full bg-brass-400/20 text-brass-600 flex items-center justify-center">
                                <DownloadIcon className="w-5 h-5" aria-hidden />
                            </span>
                            <div>
                                <h3 className="font-medium">Materiali</h3>
                                <p className="text-sm text-ink-500">Preset, sample e progetti</p>
                            </div>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}