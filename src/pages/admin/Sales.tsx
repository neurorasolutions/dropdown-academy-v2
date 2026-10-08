import { useState } from 'react'
import { getSales, money, dateTime } from '@/lib/admin'
import { useAsyncData } from '@/hooks/useAsyncData'
import { DataState } from '@/components/common/DataState'
const labels: Record<string, string> = {
    completed: 'Completato',
    pending: 'In attesa',
    refunded: 'Rimborsato',
    failed: 'Non riuscito',
}
export default function AdminSales() {
    const { data, loading, error, reload } = useAsyncData(getSales)
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('all')
    const rows = (data || []).filter(
        (s) =>
            (status === 'all' || s.status === status) &&
            `${s.course?.title} ${s.student?.email} ${s.student?.full_name} ${s.paypal_order_id}`
                .toLowerCase()
                .includes(search.toLowerCase()),
    )
    return (
        <div className="space-y-6">
            <h2 className="font-serif text-2xl">Vendite</h2>
            <div className="flex flex-wrap gap-3">
                <input
                    className="input-field flex-1"
                    aria-label="Cerca vendite"
                    placeholder="Cerca corso, studente o ordine…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    aria-label="Stato pagamento"
                    className="input-field sm:w-auto"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="all">Tutti gli stati</option>
                    {Object.entries(labels).map(([v, l]) => (
                        <option key={v} value={v}>
                            {l}
                        </option>
                    ))}
                </select>
            </div>
            <DataState loading={loading} error={error} retry={reload} />
            {!loading && !error && (
                <>
                    <p className="text-ink-500">
                        {rows.length} risultati · Totale completato:{' '}
                        {money(
                            rows
                                .filter((s) => s.status === 'completed')
                                .reduce((n, s) => n + Number(s.amount_paid), 0),
                        )}
                    </p>
                    <div className="card overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="bg-ivory-100">
                                    {['Corso / ordine', 'Studente', 'Data', 'Importo', 'Stato'].map((t) => (
                                        <th key={t} className="p-4">
                                            {t}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((s) => (
                                    <tr key={s.id} className="border-t border-ivory-200">
                                        <td className="p-4">
                                            {s.course?.title || 'Corso'}
                                            <small className="block text-ink-500 break-all">
                                                {s.paypal_order_id || '—'}
                                            </small>
                                        </td>
                                        <td className="p-4">
                                            {s.student?.full_name}
                                            <small className="block">{s.student?.email || '—'}</small>
                                        </td>
                                        <td className="p-4 whitespace-nowrap">{dateTime(s.payment_date)}</td>
                                        <td className="p-4 whitespace-nowrap">{money(s.amount_paid)}</td>
                                        <td className="p-4">{labels[s.status]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {!rows.length && <p className="p-8 text-center">Nessuna vendita trovata.</p>}
                    </div>
                </>
            )}
        </div>
    )
}
