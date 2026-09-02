import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Menu, X, LayoutDashboard, User } from 'lucide-react'

const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Corsi Online', path: '/courses' },
    { label: 'In Presenza', path: '/in-presenza' },
    { label: 'Risorse Gratuite', path: '/free-videos' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contatti', path: '/contact' },
]

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const { user, profile, signOut } = useAuthStore()
    const navigate = useNavigate()

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 8)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const handleSignOut = async () => {
        await signOut()
        navigate('/')
    }

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `text-sm font-medium transition-colors duration-200 cursor-pointer ${
            isActive
                ? 'text-wine-700'
                : 'text-ink-700 hover:text-wine-700'
        }`

    return (
        <header
            className={`sticky top-0 z-40 transition-all duration-300 border-b ${
                isScrolled
                    ? 'bg-ivory-100/95 backdrop-blur border-ivory-300 shadow-soft'
                    : 'bg-ivory-100 border-transparent'
            }`}
        >
            <div className="container-site">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3" aria-label="Dropdown Academy — Home">
                        <img
                            src="/logo-dark.png"
                            alt="Dropdown Academy"
                            className="h-9 w-auto"
                            width={36}
                            height={36}
                        />
                        <span className="font-serif text-lg font-semibold tracking-tight hidden sm:block">
                            Dropdown <span className="italic text-brass-600">Academy</span>
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden lg:flex items-center gap-8" aria-label="Navigazione principale">
                        {navItems.map((item) => (
                            <NavLink key={item.path} to={item.path} className={linkClass} end={item.path === '/'}>
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Desktop auth */}
                    <div className="hidden lg:flex items-center gap-3">
                        {user ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="btn-ghost text-sm"
                                >
                                    <User className="w-4 h-4" aria-hidden />
                                    Area personale
                                </Link>
                                {profile?.is_admin && (
                                    <Link to="/admin" className="btn-ghost text-sm">
                                        <LayoutDashboard className="w-4 h-4" aria-hidden />
                                        Admin
                                    </Link>
                                )}
                                <button
                                    onClick={handleSignOut}
                                    className="btn-primary text-sm px-4 py-2"
                                >
                                    Esci
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn-ghost text-sm">
                                    Accedi
                                </Link>
                                <Link to="/register" className="btn-primary text-sm px-5 py-2.5">
                                    Registrati
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile toggle */}
                    <button
                        className="lg:hidden p-2 text-ink-700 cursor-pointer"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label={isMenuOpen ? 'Chiudi menu' : 'Apri menu'}
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <nav
                    className="lg:hidden bg-ivory-100 border-t border-ivory-300 px-4 pt-4 pb-6 space-y-1"
                    aria-label="Menu mobile"
                >
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/'}
                            className={({ isActive }) =>
                                `block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                                    isActive
                                        ? 'bg-wine-700/10 text-wine-700'
                                        : 'text-ink-700 hover:bg-ivory-200'
                                }`
                            }
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                    <div className="pt-4 mt-2 border-t border-ivory-300 space-y-2">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="btn-secondary w-full" onClick={() => setIsMenuOpen(false)}>
                                    Area personale
                                </Link>
                                <button onClick={handleSignOut} className="btn-primary w-full">
                                    Esci
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn-secondary w-full" onClick={() => setIsMenuOpen(false)}>
                                    Accedi
                                </Link>
                                <Link to="/register" className="btn-primary w-full" onClick={() => setIsMenuOpen(false)}>
                                    Registrati
                                </Link>
                            </>
                        )}
                    </div>
                </nav>
            )}
        </header>
    )
}