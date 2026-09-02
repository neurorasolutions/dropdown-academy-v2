import { Link } from 'react-router-dom'
import { Youtube, Instagram, Facebook, Mail } from 'lucide-react'

const footerNav = {
    nav: [
        { label: 'Home', path: '/' },
        { label: 'Corsi Online', path: '/courses' },
        { label: 'In Presenza', path: '/in-presenza' },
        { label: 'Risorse Gratuite', path: '/free-videos' },
        { label: 'FAQ', path: '/faq' },
        { label: 'Contatti', path: '/contact' },
    ],
    account: [
        { label: 'Accedi', path: '/login' },
        { label: 'Registrati', path: '/register' },
        { label: 'Area Personale', path: '/dashboard' },
    ],
    legal: [
        { label: 'Privacy Policy', path: '/privacy' },
        { label: 'Termini di Servizio', path: '/terms' },
        { label: 'Cookie Policy', path: '/cookies' },
    ],
}

const socialLinks = [
    { icon: Youtube, href: 'https://youtube.com/@dropdownacademy', label: 'YouTube' },
    { icon: Instagram, href: 'https://instagram.com/dropdownacademy', label: 'Instagram' },
    { icon: Facebook, href: 'https://facebook.com/dropdownacademy', label: 'Facebook' },
]

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-wine-950 text-ivory-200 mt-24">
            <div className="container-site py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <img
                                src="/logo-dark.png"
                                alt=""
                                aria-hidden
                                className="h-10 w-auto brightness-0 invert opacity-90"
                                width={40}
                                height={40}
                            />
                            <span className="font-serif text-xl font-semibold text-ivory-50">
                                Dropdown <span className="italic text-brass-300">Academy</span>
                            </span>
                        </div>
                        <p className="text-sm text-ivory-200/70 leading-relaxed">
                            Formazione di eccellenza in sound design e produzione musicale.
                            Corsi online e masterclass in presenza a Vigevano.
                        </p>
                        <a
                            href="mailto:info@dropdownacademy.com"
                            className="inline-flex items-center gap-2 text-sm text-ivory-200/80 hover:text-brass-300 transition-colors"
                        >
                            <Mail className="w-4 h-4" aria-hidden />
                            info@dropdownacademy.com
                        </a>
                    </div>

                    {/* Navigazione */}
                    <nav aria-label="Navigazione footer">
                        <h3 className="eyebrow mb-4 text-brass-300">Esplora</h3>
                        <ul className="space-y-2.5">
                            {footerNav.nav.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className="text-sm text-ivory-200/80 hover:text-ivory-50 transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Account */}
                    <nav aria-label="Account">
                        <h3 className="eyebrow mb-4 text-brass-300">Account</h3>
                        <ul className="space-y-2.5">
                            {footerNav.account.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className="text-sm text-ivory-200/80 hover:text-ivory-50 transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Legal + social */}
                    <div>
                        <h3 className="eyebrow mb-4 text-brass-300">Legale</h3>
                        <ul className="space-y-2.5 mb-6">
                            {footerNav.legal.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className="text-sm text-ivory-200/80 hover:text-ivory-50 transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="flex gap-3">
                            {socialLinks.map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2.5 rounded-full border border-ivory-200/20 text-ivory-200/80 hover:text-brass-300 hover:border-brass-300/40 transition-colors"
                                    aria-label={label}
                                >
                                    <Icon className="w-4 h-4" aria-hidden />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-14 pt-8 border-t border-ivory-200/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-ivory-200/50">
                        © {currentYear} Dropdown Academy. Tutti i diritti riservati.
                    </p>
                    <p className="text-xs text-ivory-200/50">
                        Sound Design · Produzione Musicale · Vigevano (PV)
                    </p>
                </div>
            </div>
        </footer>
    )
}