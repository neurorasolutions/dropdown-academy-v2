import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { useAuthStore } from '@/store/authStore'
import { useEffect } from 'react'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { ToastContainer } from '@/components/common/ToastContainer'

const paypalOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test',
    currency: 'EUR',
    intent: 'capture',
}

export default function App() {
    const initialize = useAuthStore((s) => s.initialize)

    useEffect(() => {
        initialize()
    }, [initialize])

    return (
        <PayPalScriptProvider options={paypalOptions}>
            <RouterProvider router={router} />
            <ToastContainer />
        </PayPalScriptProvider>
    )
}