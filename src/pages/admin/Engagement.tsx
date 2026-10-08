import { getEngagement, money, dateTime, getSales } from '@/lib/admin'
import type { Sale } from '@/lib/admin'
import { useAsyncData } from '@/hooks/useAsyncData'
import { DataState } from '@/components/common/DataState'

export default function AdminEngagement() {
    const engagement = useAsyncData(getEngagement)
    const sales = useAsyncData<Sale[]>(getSales)
    const rows = engagement.data || []
    const completedSales = (sales.data || []).filter((s) => s.status === 'completed')
    const revenue = completedSales.reduce((n, s) => n + Number(s.amount_paid), 0)
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const revenueMonth = completedSales
        .filter((s) => new Date(s.payment_date) >= monthStart)
        .reduce((n, s) => n + Number(s.amount_paid), 0)
    const byCourse = new Map<string, { title: string; count: number; revenue: number }>()
    for (const s of completedSales) {
        const title = s.course?.title || 'Corso'
        const entry = byCourse.get(title) || { title, count: 0, revenue: 0 }
        entry.count++
        entry.revenue += Number(s.amount_paid)
        byCourse.set(title, entry)
    }
    const courseRows = [...byCourse.values()].sort((a, b) => b.revenue - a.revenue)
    const average = rows.length ? Math.round(rows.reduce((n, r) => n + r.percent, 0) / rows.length) : 0
    const stalled = rows.filter((r) => r.percent > 0 && r.percent < 100).length

    return (
        <div className="space-y-8">
            <h2 className="font-serif text-2xl">Monitoraggio</h2>

            <DataState loading={sales.loading} error={sales.error} retry={sales.reload} />
            {!sales.loading && !sales.error && (
                <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[
                        ['Incasso totale', money(revenue)],
                        ['Incasso del mese', money(revenueMonth)],
                        ['Acquisti completati', String(completedSales.length)],
                        ['Avanzamento medio', `${average}%`],
                    ].map(([label, value]) => (
                        <div key={label} className="card p-6">
                            <p className="text-sm text-ink-500">{label}</p>
                            <p className="font-serif text-3xl mt-3 tabular-nums">{value}</p>
                        </div>
                    ))}
                </div>
            )}

            <section className="space-y-4">
                <h3 className="font-serif text-xl">Ricavi per corso</h3>
                <DataState loading={sales.loading} error={sales.error} retry={sales.reload} />
                {!sales.loading && !sales.error && !courseRows.length && (
                    <p className="card p-6 text-center text-ink-500">Nessun acquisto completato.</p>
                )}
                {!!courseRows.length && (
                    <div className="card overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="bg-ivory-100">
                                    {['Corso', 'Acquisti', 'Ricavo'].map((t) => (
                                        <th key={t} className="p-4">
                                            {t}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {courseRows.map((c) => (
                                    <tr key={c.title} className="border-t border-ivory-200">
                                        <td className="p-4">{c.title}</td>
                                        <td className="p-4 tabular-nums">{c.count}</td>
                                        <td className="p-4 tabular-nums">{money(c.revenue)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <section className="space-y-4">
                <div className="flex flex-wrap items-baseline gap-3">
                    <h3 className="font-serif text-xl">Avanzamento studenti</h3>
                    {!!rows.length && (
                        <span className="text-sm text-ink-500">
                            {stalled} in corso · {rows.filter((r) => r.percent === 100).length} completati
                        </span>
                    )}
                </div>
                <DataState loading={engagement.loading} error={engagement.error} retry={engagement.reload} />
                {!engagement.loading && !engagement.error && !rows.length && (
                    <p className="card p-6 text-center text-ink-500">
                        Nessuno studente ha ancora acquistato un corso.
                    </p>
                )}
                {!!rows.length && (
                    <div className="card overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="bg-ivory-100">
                                    {['Studente', 'Corso', 'Avanzamento', 'Ultima attività', 'Acquisto'].map((t) => (
                                        <th key={t} className="p-4">
                                            {t}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((r, i) => (
                                    <tr key={`${r.email}-${r.course}-${i}`} className="border-t border-ivory-200">
                                        <td className="p-4">
                                            {r.student}
                                            <small className="block text-ink-500">{r.email}</small>
                                        </td>
                                        <td className="p-4">{r.course}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3 min-w-[140px]">
                                                <div className="flex-1 h-1.5 bg-ivory-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-wine-700 rounded-full"
                                                        style={{ width: `${r.percent}%` }}
                                                    />
                                                </div>
                                                <span className="tabular-nums whitespace-nowrap">
                                                    {r.completed}/{r.total} · {r.percent}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            {r.lastActivity ? dateTime(r.lastActivity) : 'Mai iniziato'}
                                        </td>
                                        <td className="p-4 whitespace-nowrap">{dateTime(r.purchasedAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    )
}
