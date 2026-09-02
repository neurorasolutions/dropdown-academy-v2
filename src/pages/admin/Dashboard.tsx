import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, BookOpen, ShoppingBag, Download, Mail, ArrowLeft } from 'lucide-react'

const adminNav = [
    { path: '/admin', label: 'Panoramica', icon: LayoutDashboard, end: true },
    { path: '/admin/courses', label: 'Corsi', icon: BookOpen, end: false },
    { path: '/admin/sales', label: 'Vendite', icon: ShoppingBag, end: false },
    { path: '/admin/downloads', label: 'Download', icon: Download, end: false },
    { path: '/admin/messages', label: 'Messaggi', icon: Mail, end: false },
]

export default function AdminDashboard() {
    const { pathname } = useLocation()

    return (
        <div className="min-h-[calc(100dvh-5rem)] bg-ivory-50">
            <div className="container-site py-8 lg:py-12">
                <div className="mb-8">
                    <NavLink to="/" className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-wine-700 transition-colors mb-2">
                        <ArrowLeft className="w-4 h-4" aria-hidden />
                        Torna al sito
                    </NavLink>
                    <h1 className="font-serif text-3xl font-semibold mt-2">Amministrazione</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
                    <nav aria-label="Navigazione admin" className="lg:sticky lg:top-28 self-start">
                        <ul className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
                            {adminNav.map((item) => {
                                const isActive = item.end
                                    ? pathname === item.path
                                    : pathname.startsWith(item.path)
                                return (
                                    <li key={item.path} className="shrink-0">
                                        <NavLink
                                            to={item.path}
                                            end={item.end}
                                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                                                isActive
                                                    ? 'bg-wine-700 text-ivory-50'
                                                    : 'text-ink-700 hover:bg-white'
                                            }`}
                                        >
                                            <item.icon className="w-4 h-4" aria-hidden />
                                            {item.label}
                                        </NavLink>
                                    </li>
                                )
                            })}
                        </ul>
                    </nav>

                    <div className="min-w-0">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}