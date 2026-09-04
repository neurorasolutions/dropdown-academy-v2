import { type ReactNode } from 'react'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { useCookieStore } from '@/store/cookieStore'

const paypalOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test',
    currency: 'EUR',
    intent: 'capture',
}

/**
 * Carica l'SDK PayPal SOLO dopo il consenso ai cookie di pagamento.
 * GDPR: nessuno script di terze parti con cookie prima del consenso.
 */
export function ConditionalPayPalProvider({ children }: { children: ReactNode }) {
    const consent = useCookieStore((s) => s.consent)
    const paymentsAllowed = consent?.payments === true

    if (paymentsAllowed) {
        return (
            <PayPalScriptProvider options={paypalOptions} deferLoading={false}>
                {children}
            </PayPalScriptProvider>
        )
    }

    // Nessun consenso: NON carichiamo l'SDK. I pulsanti PayPal mostreranno un
    // richiamo al consenso (gestito dal componente checkout).
    return <>{children}</>
}

export { paypalOptions }