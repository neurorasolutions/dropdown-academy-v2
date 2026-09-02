import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { ToastContainer } from '@/components/common/ToastContainer'

export function MainLayout() {
    const { pathname } = useLocation()

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }, [pathname])

    return (
        <div className="min-h-dvh flex flex-col">
            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-card"
            >
                Salta al contenuto
            </a>
            <Header />
            <main id="main" className="flex-1">
                <Outlet />
            </main>
            <Footer />
            <ToastContainer />
        </div>
    )
}