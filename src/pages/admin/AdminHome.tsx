import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Users, ShoppingBag, TrendingUp } from 'lucide-react'
import { coursesData } from '@/data/courses'

const stats = [
    { label: 'Corsi pubblicati', value: Object.values(coursesData).length.toString(), icon: BookOpen, trend: null },
    { label: 'Studenti registrati', value: '—', icon: Users, trend: null },
    { label: 'Vendite totali', value: '—', icon: ShoppingBag, trend: null },
    { label: 'Incasso del mese', value: '—', icon: TrendingUp, trend: null },
]

export default function AdminHome() {
    return (
        <div className="space-y-10">
            <section>
                <h2 className="font-serif text-xl font-semibold mb-5">Panoramica</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="card p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="w-10 h-10 rounded-full bg-wine-700/10 text-wine-700 flex items-center justify-center">
                                    <stat.icon className="w-5 h-5" aria-hidden />
                                </span>
                            </div>
                            <p className="font-serif text-2xl font-semibold tabular-nums">{stat.value}</p>
                            <p className="text-sm text-ink-500 mt-1">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section>
                <div className="flex items-center justify-between mb-5">
                    <h2 className="font-serif text-xl font-semibold">Corsi</h2>
                    <Link to="/admin/courses" className="text-sm font-medium text-wine-700 hover:underline underline-offset-2">
                        Gestisci tutti →
                    </Link>
                </div>
                <div className="card divide-y divide-ivory-300/40">
                    {Object.values(coursesData).slice(0, 5).map((course) => (
                        <div key={course.slug} className="flex items-center gap-4 px-5 py-4">
                            <img
                                src={course.thumbnail}
                                alt=""
                                aria-hidden
                                className="w-12 h-12 rounded-lg object-cover bg-ivory-200"
                                width={48}
                                height={48}
                            />
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{course.title}</p>
                                <p className="text-sm text-ink-400">{course.lessonsCount} lezioni</p>
                            </div>
                            <span className="font-semibold text-wine-700 tabular-nums shrink-0">
                                €{course.price}
                            </span>
                        </div>
                    ))}
                </div>
                <p className="mt-4 text-sm text-ink-400">
                    I dati di vendita e utenti si agganceranno a Supabase quando colleghi il progetto.
                </p>
            </section>
        </div>
    )
}