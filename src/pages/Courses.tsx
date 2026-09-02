import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, LayoutGrid, List } from 'lucide-react'
import { supabase, isDemoMode } from '@/lib/supabase'
import { coursesData } from '@/data/courses'

interface CourseCard {
    slug: string
    title: string
    description: string
    price: number
    thumbnail: string
    category: string
    level: string
    lessonsCount: number
    duration: string
}

const staticCourses: CourseCard[] = Object.values(coursesData).map((c) => ({
    slug: c.slug,
    title: c.title,
    description: c.description,
    price: c.price,
    thumbnail: c.thumbnail,
    category: c.category,
    level: c.level,
    lessonsCount: c.lessonsCount,
    duration: c.duration,
}))

const categories = [
    { value: 'all', label: 'Tutti' },
    { value: 'modulare', label: 'Sintesi Modulare' },
    { value: 'ableton', label: 'Ableton Live' },
    { value: 'serum', label: 'Serum' },
    { value: 'max-msp', label: 'Max/MSP' },
    { value: 'pigments', label: 'Pigments' },
]

const levelLabels: Record<string, string> = {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzato',
}

export default function Courses() {
    const [courses, setCourses] = useState<CourseCard[]>(staticCourses)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [selectedLevel, setSelectedLevel] = useState('all')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    useEffect(() => {
        async function fetchCourses() {
            if (isDemoMode) return
            try {
                const { data, error } = await (supabase.from('dropdown_courses') as any)
                    .select('*')
                    .eq('is_published', true)

                if (data && !error && data.length > 0) {
                    const mapped: CourseCard[] = data.map((dbCourse: any) => {
                        const staticCourse = coursesData[dbCourse.slug]
                        return {
                            slug: dbCourse.slug,
                            title: dbCourse.title,
                            description: dbCourse.description,
                            price: dbCourse.price,
                            thumbnail: dbCourse.thumbnail_url || staticCourse?.thumbnail || '',
                            category: dbCourse.category,
                            level: dbCourse.level,
                            lessonsCount: staticCourse?.lessonsCount || 0,
                            duration: staticCourse?.duration || '—',
                        }
                    })
                    setCourses(mapped)
                }
            } catch (err) {
                console.error('Error fetching courses from Supabase:', err)
            }
        }
        fetchCourses()
    }, [])

    const filtered = useMemo(() => {
        return courses.filter((course) => {
            const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.description.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory
            const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel
            return matchesSearch && matchesCategory && matchesLevel
        })
    }, [courses, searchQuery, selectedCategory, selectedLevel])

    return (
        <div className="container-site py-12 lg:py-20">
            {/* Header */}
            <header className="text-center max-w-2xl mx-auto mb-14">
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="eyebrow mb-3"
                >
                    Catalogo
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="section-title"
                >
                    Corsi <span className="italic text-wine-700">Online</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mt-4 text-ink-500 leading-relaxed"
                >
                    Percorsi video completi, accesso lifetime e materiali inclusi.
                    Impara al tuo ritmo, dove vuoi.
                </motion.p>
            </header>

            {/* Filtri */}
            <div className="mb-10 space-y-4">
                <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" aria-hidden />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cerca un corso…"
                            aria-label="Cerca un corso"
                            className="input-field pl-11"
                        />
                    </div>
                    <div className="flex items-center gap-2" role="group" aria-label="Modalità di visualizzazione">
                        <button
                            onClick={() => setViewMode('grid')}
                            aria-label="Vista griglia"
                            aria-pressed={viewMode === 'grid'}
                            className={`p-2.5 rounded-xl border cursor-pointer transition-colors ${
                                viewMode === 'grid'
                                    ? 'border-wine-700 text-wine-700 bg-wine-700/5'
                                    : 'border-ivory-300 text-ink-400 hover:text-ink-700'
                            }`}
                        >
                            <LayoutGrid className="w-5 h-5" aria-hidden />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            aria-label="Vista lista"
                            aria-pressed={viewMode === 'list'}
                            className={`p-2.5 rounded-xl border cursor-pointer transition-colors ${
                                viewMode === 'list'
                                    ? 'border-wine-700 text-wine-700 bg-wine-700/5'
                                    : 'border-ivory-300 text-ink-400 hover:text-ink-700'
                            }`}
                        >
                            <List className="w-5 h-5" aria-hidden />
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.value}
                            onClick={() => setSelectedCategory(cat.value)}
                            aria-pressed={selectedCategory === cat.value}
                            className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 ${
                                selectedCategory === cat.value
                                    ? 'bg-wine-700 text-ivory-50'
                                    : 'bg-white border border-ivory-300 text-ink-700 hover:border-wine-700/40'
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                    <select
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        aria-label="Filtra per livello"
                        className="ml-auto bg-white border border-ivory-300 rounded-full px-4 py-2 text-sm text-ink-700 cursor-pointer focus:outline-none focus:border-wine-600"
                    >
                        <option value="all">Tutti i livelli</option>
                        <option value="beginner">Principiante</option>
                        <option value="intermediate">Intermedio</option>
                        <option value="advanced">Avanzato</option>
                    </select>
                </div>
            </div>

            {/* Griglia / lista */}
            {filtered.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-ink-500">Nessun corso trovato. Prova a modificare i filtri.</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.map((course, i) => (
                        <motion.div
                            key={course.slug}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
                        >
                            <CourseCardItem course={course} />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map((course) => (
                        <CourseListItem key={course.slug} course={course} />
                    ))}
                </div>
            )}
        </div>
    )
}

function CourseCardItem({ course }: { course: CourseCard }) {
    return (
        <Link to={`/courses/${course.slug}`} className="group block h-full">
            <article className="card h-full transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lift">
                <div className="aspect-[4/3] overflow-hidden bg-ivory-200">
                    <img
                        src={course.thumbnail}
                        alt={course.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        width={800}
                        height={600}
                    />
                </div>
                <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                        <h2 className="font-serif text-xl font-semibold leading-snug">{course.title}</h2>
                        <span className="shrink-0 font-serif text-lg font-semibold text-wine-700 tabular-nums">
                            €{course.price}
                        </span>
                    </div>
                    <p className="mt-2 text-sm text-ink-500 leading-relaxed line-clamp-2">{course.description}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                        <span className="px-2.5 py-1 rounded-full bg-ivory-200 text-ink-700">
                            {levelLabels[course.level] || course.level}
                        </span>
                        <span className="text-ink-400">{course.lessonsCount} lezioni</span>
                        <span className="text-ink-400">· {course.duration}</span>
                    </div>
                </div>
            </article>
        </Link>
    )
}

function CourseListItem({ course }: { course: CourseCard }) {
    return (
        <Link to={`/courses/${course.slug}`} className="group block">
            <article className="card flex flex-col sm:flex-row overflow-hidden transition-all duration-300 group-hover:shadow-lift">
                <div className="sm:w-56 aspect-[4/3] sm:aspect-auto sm:h-auto overflow-hidden bg-ivory-200 shrink-0">
                    <img
                        src={course.thumbnail}
                        alt={course.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                        width={400}
                        height={300}
                    />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-center">
                    <div className="flex items-start justify-between gap-4">
                        <h2 className="font-serif text-xl font-semibold">{course.title}</h2>
                        <span className="shrink-0 font-serif text-lg font-semibold text-wine-700 tabular-nums">
                            €{course.price}
                        </span>
                    </div>
                    <p className="mt-2 text-sm text-ink-500 leading-relaxed">{course.description}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                        <span className="px-2.5 py-1 rounded-full bg-ivory-200 text-ink-700">
                            {levelLabels[course.level] || course.level}
                        </span>
                        <span className="text-ink-400">{course.lessonsCount} lezioni</span>
                        <span className="text-ink-400">· {course.duration}</span>
                    </div>
                </div>
            </article>
        </Link>
    )
}