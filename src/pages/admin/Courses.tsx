import { useState } from 'react'
import { Eye, EyeOff, Search } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { coursesData } from '@/data/courses'

const categoryLabels: Record<string, string> = {
    modulare: 'Sintesi Modulare',
    ableton: 'Ableton Live',
    serum: 'Serum',
    'max-msp': 'Max/MSP',
    pigments: 'Pigments',
    altro: 'Altro',
}

export default function AdminCourses() {
    const [searchQuery, setSearchQuery] = useState('')
    const [filterPublished, setFilterPublished] = useState<'all' | 'published' | 'draft'>('all')
    const [published, setPublished] = useState<Record<string, boolean>>(
        Object.fromEntries(Object.keys(coursesData).map((slug) => [slug, true]))
    )
    const { showToast } = useUIStore()

    const courses = Object.values(coursesData).map((c) => ({
        slug: c.slug,
        title: c.title,
        category: c.category,
        price: c.price,
    }))

    const filtered = courses.filter((course) => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase())
        const isPub = published[course.slug] ?? true
        const matchesFilter =
            filterPublished === 'all' ||
            (filterPublished === 'published' && isPub) ||
            (filterPublished === 'draft' && !isPub)
        return matchesSearch && matchesFilter
    })

    const togglePublish = (slug: string) => {
        setPublished((prev) => ({ ...prev, [slug]: !prev[slug] }))
        showToast({ type: 'success', message: 'Stato pubblicazione aggiornato (demo: collega Supabase per salvare)' })
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" aria-hidden />
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cerca corso…"
                        aria-label="Cerca corso"
                        className="input-field pl-11"
                    />
                </div>
                <div className="flex gap-2" role="group" aria-label="Filtra per stato">
                    {(['all', 'published', 'draft'] as const).map((value) => (
                        <button
                            key={value}
                            onClick={() => setFilterPublished(value)}
                            aria-pressed={filterPublished === value}
                            className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                                filterPublished === value
                                    ? 'bg-wine-700 text-ivory-50'
                                    : 'bg-white border border-ivory-300 text-ink-700 hover:border-wine-700/40'
                            }`}
                        >
                            {value === 'all' ? 'Tutti' : value === 'published' ? 'Pubblicati' : 'Bozze'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="card">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-ivory-300/60 text-left text-xs uppercase tracking-wider text-ink-400">
                            <th className="px-5 py-4 font-medium">Corso</th>
                            <th className="px-5 py-4 font-medium">Categoria</th>
                            <th className="px-5 py-4 font-medium">Prezzo</th>
                            <th className="px-5 py-4 font-medium text-right">Stato</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-ivory-300/40">
                        {filtered.map((course) => (
                            <tr key={course.slug} className="hover:bg-ivory-50 transition-colors">
                                <td className="px-5 py-4 font-medium">{course.title}</td>
                                <td className="px-5 py-4 text-ink-500">{categoryLabels[course.category]}</td>
                                <td className="px-5 py-4 tabular-nums">€{course.price}</td>
                                <td className="px-5 py-4 text-right">
                                    <button
                                        onClick={() => togglePublish(course.slug)}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                                            published[course.slug]
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-ivory-200 text-ink-500'
                                        }`}
                                        aria-pressed={published[course.slug]}
                                    >
                                        {published[course.slug] ? (
                                            <>
                                                <Eye className="w-3.5 h-3.5" aria-hidden />
                                                Pubblicato
                                            </>
                                        ) : (
                                            <>
                                                <EyeOff className="w-3.5 h-3.5" aria-hidden />
                                                Bozza
                                            </>
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <p className="px-5 py-10 text-center text-ink-400">Nessun corso trovato.</p>
                )}
            </div>
        </div>
    )
}