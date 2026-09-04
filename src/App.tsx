import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { useAuthStore } from '@/store/authStore'
import { useEffect } from 'react'
import { ToastContainer } from '@/components/common/ToastContainer'
import { ConditionalPayPalProvider } from '@/components/common/ConditionalPayPalProvider'

export default function App() {
    const initialize = useAuthStore((s) => s.initialize)

    useEffect(() => {
        initialize()
    }, [initialize])

    return (
        <ConditionalPayPalProvider>
            <RouterProvider router={router} />
            <ToastContainer />
        </ConditionalPayPalProvider>
    )
}