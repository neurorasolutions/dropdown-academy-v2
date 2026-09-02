import { useState } from 'react'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { recordPurchase } from '@/lib/purchases'

interface PayPalCheckoutProps {
    courseSlug: string
    courseTitle: string
    price: number
    userId: string
    onSuccess?: (transactionId: string) => void
}

export function PayPalCheckout({ courseSlug, courseTitle, price, userId, onSuccess }: PayPalCheckoutProps) {
    const [{ isPending }] = usePayPalScriptReducer()
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState('')
    const [transactionId, setTransactionId] = useState('')

    if (paymentStatus === 'success') {
        return (
            <div className="p-8 bg-white border border-ivory-300 rounded-2xl text-center space-y-3 shadow-card">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto" aria-hidden />
                <h3 className="font-serif text-xl font-semibold">Pagamento completato</h3>
                <p className="text-ink-500">
                    Hai acquistato <strong>{courseTitle}</strong>. Il corso è ora disponibile nella tua area personale.
                </p>
                <p className="text-xs text-ink-400">ID transazione: {transactionId}</p>
            </div>
        )
    }

    if (paymentStatus === 'error') {
        return (
            <div className="p-8 bg-white border border-red-200 rounded-2xl text-center space-y-3 shadow-card">
                <AlertCircle className="w-12 h-12 text-red-600 mx-auto" aria-hidden />
                <h3 className="font-serif text-xl font-semibold">Errore nel pagamento</h3>
                <p className="text-ink-500">{errorMessage}</p>
                <button
                    onClick={() => {
                        setPaymentStatus('idle')
                        setErrorMessage('')
                    }}
                    className="btn-secondary"
                >
                    Riprova
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-5">
            <div className="text-center">
                <p className="text-sm text-ink-500 mb-1">Prezzo del corso</p>
                <span className="font-serif text-4xl font-semibold text-wine-700 tabular-nums">
                    €{price.toFixed(2)}
                </span>
            </div>

            {isPending && (
                <div className="flex items-center justify-center py-8" role="status">
                    <Loader2 className="w-6 h-6 text-wine-700 animate-spin" aria-hidden />
                    <span className="ml-3 text-ink-500">Caricamento PayPal…</span>
                </div>
            )}

            {paymentStatus === 'processing' && (
                <div className="flex items-center justify-center py-4" role="status">
                    <Loader2 className="w-5 h-5 text-wine-700 animate-spin" aria-hidden />
                    <span className="ml-2 text-ink-500">Elaborazione pagamento…</span>
                </div>
            )}

            <div className={paymentStatus === 'processing' ? 'opacity-50 pointer-events-none' : ''}>
                <PayPalButtons
                    style={{
                        layout: 'vertical',
                        color: 'black',
                        shape: 'rect',
                        label: 'pay',
                        height: 48,
                    }}
                    createOrder={async () => {
                        try {
                            const response = await fetch('/api/create-order', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ courseSlug }),
                            })

                            if (!response.ok) {
                                throw new Error('Errore nella creazione dell\'ordine')
                            }

                            const data = await response.json()
                            return data.orderID
                        } catch (error) {
                            console.error('Create order error:', error)
                            setPaymentStatus('error')
                            setErrorMessage('Impossibile creare l\'ordine. Riprova più tardi.')
                            throw error
                        }
                    }}
                    onApprove={async (data) => {
                        setPaymentStatus('processing')

                        try {
                            const response = await fetch('/api/capture-order', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ orderID: data.orderID }),
                            })

                            if (!response.ok) {
                                throw new Error('Errore nella conferma del pagamento')
                            }

                            const captureData = await response.json()

                            if (captureData.success) {
                                setTransactionId(captureData.transactionId)
                                setPaymentStatus('success')
                                await recordPurchase(userId, courseSlug, price, captureData.transactionId)
                                onSuccess?.(captureData.transactionId)
                            } else {
                                throw new Error(captureData.error || 'Pagamento non completato')
                            }
                        } catch (error) {
                            console.error('Capture error:', error)
                            setPaymentStatus('error')
                            setErrorMessage(
                                error instanceof Error
                                    ? error.message
                                    : 'Si è verificato un errore. Contattaci per assistenza.'
                            )
                        }
                    }}
                    onError={(err) => {
                        console.error('PayPal error:', err)
                        setPaymentStatus('error')
                        setErrorMessage('Errore PayPal. Riprova più tardi.')
                    }}
                    onCancel={() => {
                        setPaymentStatus('idle')
                    }}
                />
            </div>

            <p className="text-center text-xs text-ink-400">
                Pagamento sicuro tramite PayPal. I tuoi dati sono protetti.
            </p>
        </div>
    )
}