import { Link } from 'react-router-dom'
import { getOverview, money } from '@/lib/admin'
import { useAsyncData } from '@/hooks/useAsyncData'
import { DataState } from '@/components/common/DataState'
export default function AdminHome() {
    const { data, loading, error, reload } = useAsyncData(getOverview)
    return (
        <div className="space-y-8">
            <h2 className="font-serif text-2xl">Panoramica</h2>
            <DataState loading={loading} error={error} retry={reload} />
            {data && !loading && !error && (
                <>
                    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        {[
                            ['Corsi pubblicati', data.courses.filter((c) => c.is_published).length],
                            ['Studenti registrati', data.students],
                            ['Acquisti completati', data.sales],
                            ['Incasso del mese', money(data.revenue)],
                        ].map(([label, value]) => (
                            <div key={label} className="card p-6">
                                <p className="text-sm text-ink-500">{label}</p>
                                <p className="font-serif text-3xl mt-3 tabular-nums">{value}</p>
                            </div>
                        ))}
                    </div>
                    <Link to="/admin/messages" className="card p-5 block text-wine-700">
                        {data.unread} messaggi da leggere →
                    </Link>
                    <div className="card divide-y divide-ivory-200">
                        {data.courses.map((c) => (
                            <Link
                                key={c.id}
                                to={`/admin/courses/${c.id}`}
                                className="p-5 flex justify-between gap-4"
                            >
                                <span>
                                    {c.title}
                                    <small className="block text-ink-500">
                                        {c.is_published ? 'Pubblicato' : 'Bozza'}
                                    </small>
                                </span>
                                <span>{money(c.price)}</span>
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
