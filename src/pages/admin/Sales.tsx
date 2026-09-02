import { ShoppingBag } from 'lucide-react'

export default function AdminSales() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 text-ink-400">
                <ShoppingBag className="w-5 h-5" aria-hidden />
                <p className="text-sm">
                    La lista vendite si popolerà dai dati della tabella <code className="text-xs bg-ivory-200 px-1.5 py-0.5 rounded">purchases</code> di Supabase.
                </p>
            </div>
            <div className="card p-12 text-center">
                <p className="text-ink-500">
                    Nessuna vendita visualizzabile: collega Supabase e i pagamenti PayPal reali compariranno qui.
                </p>
            </div>
        </div>
    )
}