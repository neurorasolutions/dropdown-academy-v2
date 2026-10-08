import { useState } from 'react'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { supabase } from '@/lib/supabase'
import { Link } from 'react-router-dom'
interface Props {
    courseSlug: string
    courseTitle: string
    price: number
    onSuccess?: (id: string) => void
}
async function request(path: string, body: unknown) {
    const { data } = await supabase.auth.getSession()
    if (!data.session) throw new Error('Sessione scaduta. Accedi di nuovo.')
    const res = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.session.access_token}` },
        body: JSON.stringify(body),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || 'Operazione non riuscita. Riprova.')
    return json
}
export function PayPalCheckout({ courseSlug, courseTitle, price, onSuccess }: Props) {
    const [{ isPending, isRejected }] = usePayPalScriptReducer()
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState('')
    const [order, setOrder] = useState(() => sessionStorage.getItem(`dropdown-order-${courseSlug}`) || '')
    const [success, setSuccess] = useState(false)
    async function capture(id: string) {
        setBusy(true)
        setError('')
        setOrder(id)
        sessionStorage.setItem(`dropdown-order-${courseSlug}`, id)
        try {
            const result = await request('/api/capture-order', { orderID: id })
            if (!result.success) throw new Error(result.error)
            sessionStorage.removeItem(`dropdown-order-${courseSlug}`)
            setSuccess(true)
            onSuccess?.(result.transactionId)
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Verifica non riuscita.')
        } finally {
            setBusy(false)
        }
    }
    if (success)
        return (
            <div role="status" className="card p-6">
                <h3 className="font-serif text-xl">Acquisto completato</h3>
                <p className="mt-3">{courseTitle} è disponibile nella tua area personale.</p>
                <Link className="btn-primary mt-4" to={`/courses/${courseSlug}/player`}>
                    Inizia il corso
                </Link>
            </div>
        )
    return (
        <div className="space-y-4">
            <p className="font-serif text-3xl text-center text-wine-700">€{price.toFixed(2)}</p>
            {(isPending || busy) && (
                <p role="status">{busy ? 'Verifica del pagamento…' : 'Caricamento PayPal…'}</p>
            )}
            {isRejected && (
                <p role="alert">PayPal non è disponibile. Ricarica la pagina o riprova più tardi.</p>
            )}
            {error && (
                <p role="alert" className="text-red-700">
                    {error}
                </p>
            )}
            {order ? (
                <div className="space-y-3">
                    <p className="text-sm break-all">Ordine: {order}</p>
                    <button disabled={busy} onClick={() => capture(order)} className="btn-primary w-full">
                        Verifica accesso
                    </button>
                    <p className="text-xs text-ink-500">
                        La verifica riutilizza questo ordine. Se il problema continua,{' '}
                        <Link className="underline" to="/contact">
                            contattaci
                        </Link>{' '}
                        indicando il numero d’ordine.
                    </p>
                </div>
            ) : (
                <PayPalButtons
                    disabled={busy}
                    style={{ layout: 'vertical', color: 'black', shape: 'rect', height: 48 }}
                    createOrder={async () => {
                        setError('')
                        try {
                            const result = await request('/api/create-order', { courseSlug })
                            return result.orderID
                        } catch (e) {
                            setError(e instanceof Error ? e.message : 'Impossibile creare l’ordine.')
                            throw e
                        }
                    }}
                    onApprove={async (data) => {
                        await capture(data.orderID)
                    }}
                    onCancel={() => setError('Pagamento annullato. Puoi riprovare quando vuoi.')}
                    onError={() => setError('PayPal non ha completato l’operazione. Riprova più tardi.')}
                />
            )}
        </div>
    )
}
