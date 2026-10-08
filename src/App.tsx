import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { useAuthStore } from '@/store/authStore'
import { useEffect } from 'react'
import { ToastContainer } from '@/components/common/ToastContainer'
import { Analytics } from '@/components/common/Analytics'
import { MotionConfig } from 'framer-motion'

export default function App() {
    const initialize = useAuthStore((s) => s.initialize)

    useEffect(() => {
        initialize()
    }, [initialize])

    return (
        <MotionConfig reducedMotion="user">
            <RouterProvider router={router} />
            <Analytics />
            <ToastContainer />
        </MotionConfig>
    )
}