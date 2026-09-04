import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { motion } from 'framer-motion'
import { Check, Clock, Layers, PlayCircle, ShieldCheck } from 'lucide-react'
import { coursesData } from '@/data/courses'
import { useAuthStore } from '@/store/authStore'
import { getPurchasedCourseSlugs } from '@/lib/purchases'
import { supabase, isDemoMode } from '@/lib/supabase'
import { PayPalCheckout } from '@/components/PayPalCheckout'
import { recordPurchase } from '@/lib/purchases'
import { useCookieStore } from '@/store/cookieStore'

interface ModuleData {
    id: string
    title: string
    lessons: { id: string; title: string; duration: string; isFree: boolean }[]
}

interface CourseFull {
    slug: string
    title: string
    description: string
    longDescription: string
    price: number
    thumbnail: string
    lessonsCount: number
    duration: string
    features: string[]
    modules: ModuleData[]
    level: string
    category: string
}

const levelLabels: Record<string, string> = {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzato',
}

export default function CourseDetail() {
    const { slug } = useParams()
    const { user } = useAuthStore()
    const [course, setCourse] = useState<CourseFull | null>(
        slug ? (coursesData[slug] as unknown as CourseFull) ?? null : null
    )
    const [isLoadingAccess, setIsLoadingAccess] = useState(true)
    const [isPurchased, setIsPurchased] = useState(false)

    useEffect(() => {
        async function loadCourseAndAccess() {
            if (slug && !isDemoMode) {
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
                                lessons: (m.dropdown_lessons || [])
                                    .map((l: any) => ({
                                        id: l.id,
                                        title: l.title,
                                        duration: l.video_duration
                                            ? `${Math.floor(l.video_duration / 60)}:${String(Math.floor(l.video_duration % 60)).padStart(2, '0')}`
                                            : '0:00',
                                        isFree: l.is_free,
                                    }))
                                    .sort((a: any, b: any) => a.order_index - b.order_index),
                            }))
                            .sort((a: any, b: any) => a.order_index - b.order_index)

                        setCourse({
                            slug: data.slug,
                            title: data.title,
                            description: data.description,
                            longDescription: staticCourseLong(data.slug) || data.description,
                            price: Number(data.price),
                            thumbnail: data.thumbnail_url || coursesData[data.slug]?.thumbnail || '',
                            lessonsCount: (data.dropdown_course_modules || []).reduce(
                                (acc: number, m: any) => acc + (m.dropdown_lessons?.length || 0), 0
                            ) || coursesData[data.slug]?.lessonsCount || 0,
                            duration: coursesData[data.slug]?.duration || '—',
                            features: coursesData[data.slug]?.features || [],
                            modules: sortedModules,
                            level: data.level,
                            category: data.category,
                        })
                    }
                } catch (err) {
                    console.error('Error fetching course:', err)
                }
            }

            if (user && slug) {
                try {
                    const purchasedSlugs = await getPurchasedCourseSlugs(user.id)
                    setIsPurchased(purchasedSlugs.includes(slug))
                } catch (e) {
                    console.error('Error checking course access:', e)
                }
            }
            setIsLoadingAccess(false)
        }
        loadCourseAndAccess()
    }, [user, slug])

    if (!course) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="font-serif text-3xl font-semibold mb-4">Corso non trovato</h1>
                    <Link to="/courses" className="btn-primary">
                        Torna ai corsi
                    </Link>
                </div>
            </div>
        )
    }

    const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0)
    const freeLessons = course.modules.reduce(
        (acc, m) => acc + m.lessons.filter((l) => l.isFree).length, 0
    )

    return (
        <div className="pb-24">
            {/* Hero */}
            <section className="relative h-[45vh] min-h-[360px] overflow-hidden">
                <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    width={1080}
                    height={1080}
                />
                <div
                    className="absolute inset-0 bg-gradient-to-t from-wine-950 via-wine-950/60 to-wine-950/20"
                    aria-hidden
                />
                <div className="absolute inset-x-0 bottom-0">
                    <div className="container-site pb-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-ivory-50 max-w-3xl"
                        >
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full bg-ivory-50/15 backdrop-blur text-xs font-medium text-ivory-100">
                                    {levelLabels[course.level] || course.level}
                                </span>
                                {course.duration && (
                                    <span className="inline-flex items-center gap-1.5 text-sm text-ivory-200/80">
                                        <Clock className="w-4 h-4" aria-hidden />
                                        {course.duration}
                                    </span>
                                )}
                                <span className="inline-flex items-center gap-1.5 text-sm text-ivory-200/80">
                                    <Layers className="w-4 h-4" aria-hidden />
                                    {totalLessons || course.lessonsCount} lezioni
                                </span>
                            </div>
                            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight">
                                {course.title}
                            </h1>
                            <p className="mt-3 text-ivory-200/85 leading-relaxed max-w-2xl">
                                {course.description}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            <div className="container-site mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Contenuto principale */}
                <div className="lg:col-span-2 space-y-12">
                    <section>
                        <h2 className="font-serif text-2xl font-semibold mb-4">Il corso</h2>
                        <div className="text-ink-700 leading-relaxed whitespace-pre-line">
                            {course.longDescription}
                        </div>
                    </section>

                    {/* Programma */}
                    <section>
                        <h2 className="font-serif text-2xl font-semibold mb-6">Programma</h2>
                        <div className="space-y-4">
                            {course.modules.map((module, mi) => (
                                <details
                                    key={module.id}
                                    open={mi === 0}
                                    className="card group"
                                >
                                    <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none select-none">
                                        <span className="font-medium text-ink-900">{module.title}</span>
                                        <span className="text-sm text-ink-400 shrink-0">
                                            {module.lessons.length} lezioni
                                        </span>
                                    </summary>
                                    <ul className="border-t border-ivory-300/60">
                                        {module.lessons.map((lesson) => (
                                            <li
                                                key={lesson.id}
                                                className="flex items-center justify-between gap-4 px-6 py-3.5 border-b border-ivory-300/40 last:border-b-0 hover:bg-ivory-50 transition-colors"
                                            >
                                                <span className="text-sm text-ink-700 flex items-center gap-3">
                                                    {lesson.isFree ? (
                                                        <PlayCircle className="w-4 h-4 text-brass-600 shrink-0" aria-label="Lezione gratuita" />
                                                    ) : (
                                                        <ShieldCheck className="w-4 h-4 text-ink-300 shrink-0 opacity-40" aria-hidden />
                                                    )}
                                                    {lesson.title}
                                                </span>
                                                <span className="flex items-center gap-3 text-xs text-ink-400 shrink-0">
                                                    {lesson.isFree && (
                                                        <span className="px-2 py-0.5 rounded-full bg-brass-400/20 text-brass-600 font-medium">
                                                            Free
                                                        </span>
                                                    )}
                                                    <span className="tabular-nums">{lesson.duration}</span>
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </details>
                            ))}
                        </div>
                    </section>
                    {/* Cross-sell Patreon */}
                    <section>
                        <div className="card p-6 bg-ivory-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <p className="eyebrow mb-1">Community</p>
                                <h3 className="font-serif text-lg font-semibold">
                                    Vuoi più contenuti, ogni mese?
                                </h3>
                                <p className="text-sm text-ink-500 mt-1">
                                  Tutorial esclusivi, progetti e community su Patreon, da €10/mese.
                                </p>
                            </div>
                            <a
                                href="https://www.patreon.com/c/dropdown"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-secondary shrink-0 text-sm"
                            >
                                Scopri Patreon
                                <span aria-hidden>↗</span>
                            </a>
                        </div>
                    </section>
                </div>

                {/* Sidebar acquisto */}
                <aside className="lg:col-span-1">
                    <div className="lg:sticky lg:top-28 card p-8">
                        <div className="text-center mb-6">
                            <span className="font-serif text-4xl font-semibold text-wine-700 tabular-nums">
                                €{course.price}
                            </span>
                            <p className="text-sm text-ink-400 mt-1">Accesso lifetime</p>
                        </div>

                        <ul className="space-y-3 mb-8">
                            {(course.features.length > 0
                                ? course.features
                                : ['Accesso lifetime', 'Aggiornamenti inclusi', 'Materiali scaricabili', 'Supporto diretto']
                            ).map((feature) => (
                                <li key={feature} className="flex items-start gap-3 text-sm text-ink-700">
                                    <Check className="w-4 h-4 text-brass-600 mt-0.5 shrink-0" aria-hidden />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        {isLoadingAccess ? (
                            <div className="h-12 rounded-full bg-ivory-200 animate-pulse" aria-hidden />
                        ) : isPurchased ? (
                            <Link to={`/courses/${course.slug}/player`} className="btn-primary w-full">
                                <PlayCircle className="w-5 h-5" aria-hidden />
                                Vai al corso
                            </Link>
                        ) : user ? (
                            <CheckoutBox
                                slug={course.slug}
                                courseTitle={course.title}
                                price={course.price}
                                userId={user.id}
                                onPurchased={async (transactionId) => {
                                    await recordPurchase(user.id, course.slug, course.price, transactionId)
                                    setIsPurchased(true)
                                }}
                            />
                        ) : (
                            <div className="space-y-3">
                                <Link to={`/register?redirect=/courses/${course.slug}`} className="btn-primary w-full">
                                    Registrati per acquistare
                                </Link>
                                <p className="text-center text-xs text-ink-400">
                                    Hai già un account?{' '}
                                    <Link to={`/login?redirect=/courses/${course.slug}`} className="text-wine-700 underline underline-offset-2 hover:no-underline">
                                        Accedi
                                    </Link>
                                </p>
                            </div>
                        )}

                        {freeLessons > 0 && !isPurchased && (
                            <p className="mt-4 text-center text-xs text-ink-400">
                                {freeLessons} lezion{freeLessons === 1 ? 'e gratuita' : 'i gratuite'} in anteprima
                            </p>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    )
}

function staticCourseLong(slug: string): string | null {
    const c = (coursesData as Record<string, { longDescription?: string }>)[slug]
    return c?.longDescription || null
}

function CheckoutBox({
    slug,
    courseTitle,
    price,
    userId,
    onPurchased,
}: {
    slug: string
    courseTitle: string
    price: number
    userId: string
    onPurchased: (transactionId: string) => void | Promise<void>
}) {
    const { consent, openPreferences } = useCookieStore()
    const paymentsAllowed = consent?.payments === true

    if (!paymentsAllowed) {
        return (
            <div className="p-6 bg-ivory-50 border border-ivory-300 rounded-xl text-center space-y-3">
                <ShieldCheck className="w-8 h-8 text-wine-700 mx-auto" aria-hidden />
                <p className="text-sm text-ink-700 leading-relaxed">
                    Per completare l'acquisto è necessario attivare i cookie di pagamento (PayPal).
                </p>
                <button onClick={openPreferences} className="btn-primary text-sm px-5 py-2.5">
                    Gestisci preferenze cookie
                </button>
            </div>
        )
    }

    return (
        <PayPalScriptProvider
            options={{
                clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test',
                currency: 'EUR',
                intent: 'capture',
            }}
        >
            <PayPalCheckout
                courseSlug={slug}
                courseTitle={courseTitle}
                price={price}
                userId={userId}
                onSuccess={async (transactionId) => {
                    await onPurchased(transactionId)
                }}
            />
        </PayPalScriptProvider>
    )
}