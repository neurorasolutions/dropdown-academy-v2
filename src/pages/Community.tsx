import { motion } from 'framer-motion'
import { ExternalLink, Users, Video, MessageCircle, Download } from 'lucide-react'

const benefits = [
    {
        icon: Video,
        title: 'Tutorial esclusivi',
        description: 'Tutorial video approfonditi su tutte le principali DAW: dal sound design al mixing, con passaggi completi e trucchi professionali.',
    },
    {
        icon: Users,
        title: 'Community attiva',
        description: 'Confrontati con altri produttori, chiedi consigli e condividi le tue produzioni con persone che parlano la tua lingua.',
    },
    {
        icon: MessageCircle,
        title: 'Risposte dirette',
        description: 'Accesso alle chat riservate agli iscritti: le tue domande arrivano direttamente a me.',
    },
    {
        icon: Download,
        title: 'Progetti e preset',
        description: 'File di progetto, preset e materiali exclusivi da ogni tutorial, pronti da studiare e rimpiombare.',
    },
]

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.5, ease: 'easeOut' as const },
}

export default function Community() {
    return (
        <div>
            {/* Hero */}
            <section className="bg-wine-950 text-ivory-50">
                <div className="container-site py-20 lg:py-28">
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
                        <p className="eyebrow text-brass-400 mb-4">Community</p>
                        <h1 className="font-serif text-4xl lg:text-6xl font-medium leading-tight">
                            Il tuo studio continua <span className="italic text-brass-300">su Patreon</span>
                        </h1>
                        <p className="mt-6 text-lg text-ivory-200/80 leading-relaxed max-w-2xl">
                            Ogni mese: tutorial completi, progetti scaricabili e una community
                            di produttori che si confronta. Da <strong>€10/mese</strong>, cancelli quando vuoi.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <a
                                href="https://www.patreon.com/c/dropdown"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary bg-brass-400 text-wine-950 hover:bg-brass-300"
                            >
                                Unisciti su Patreon
                                <ExternalLink className="w-4 h-4" aria-hidden />
                            </a>
                            <a
                                href="#benefici"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-ivory-200/30 text-ivory-50 font-medium transition-all duration-200 hover:border-ivory-200/60 hover:bg-ivory-50/5 cursor-pointer"
                            >
                                Scopri i benefici
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Cosa ottieni */}
            <section id="benefici" className="container-site py-20 lg:py-28 scroll-mt-20">
                <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
                    <p className="eyebrow mb-3">Membership</p>
                    <h2 className="section-title">
                        Cosa ottieni <span className="italic text-wine-700">ogni mese</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {benefits.map((b, i) => (
                        <motion.div
                            key={b.title}
                            {...fadeUp}
                            transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                            className="card p-6"
                        >
                            <div className="flex items-start gap-4">
                                <span className="w-11 h-11 rounded-full bg-wine-700/10 text-wine-700 flex items-center justify-center shrink-0">
                                    <b.icon className="w-5 h-5" aria-hidden />
                                </span>
                                <div>
                                    <h3 className="font-serif text-lg font-semibold">{b.title}</h3>
                                    <p className="text-sm text-ink-500 leading-relaxed mt-1">{b.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Contenuti recenti */}
                <motion.div {...fadeUp} className="mt-12 max-w-4xl mx-auto">
                    <div className="card p-6 bg-ivory-50">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-2 h-2 rounded-full bg-brass-500" aria-hidden />
                            <h3 className="text-sm font-medium tracking-widest2 uppercase text-ink-500">
                                Ultime uscite
                            </h3>
                        </div>
                        <ul className="space-y-3">
                            {['MEGA TUTORIAL Moog Model D'].map((post) => (
                                <li key={post} className="flex items-center justify-between gap-4 py-2 border-b border-ivory-300/50 last:border-0">
                                    <span className="text-sm text-ink-700">{post}</span>
                                    <a
                                        href="https://www.patreon.com/c/dropdown"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-wine-700 hover:underline underline-offset-2 shrink-0 inline-flex items-center gap-1"
                                    >
                                        Guarda su Patreon
                                        <ExternalLink className="w-3 h-3" aria-hidden />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>
            </section>

            {/* CTA */}
            <section className="container-site pb-20 lg:pb-28">
                <motion.div
                    {...fadeUp}
                    className="bg-wine-950 text-ivory-50 rounded-3xl px-8 py-14 lg:px-20 text-center relative overflow-hidden"
                >
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: 'radial-gradient(ellipse 60% 70% at 50% 120%, rgba(212,175,106,0.18), transparent 70%)',
                        }}
                        aria-hidden
                    />
                    <div className="relative">
                        <h2 className="font-serif text-3xl lg:text-4xl font-medium">
                            Produzione continua, <span className="italic text-brass-300">mese dopo mese</span>
                        </h2>
                        <p className="mt-4 text-ivory-200/80 max-w-xl mx-auto">
                            I corsi ti danno la base completa: la community ti tiene in allenamento,
                            ogni mese, con nuovi tutorial e confronto diretto.
                        </p>
                        <a
                            href="https://www.patreon.com/c/dropdown"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary bg-brass-400 text-wine-950 hover:bg-brass-300 mt-8"
                        >
                            Iscriviti da €10/mese
                            <ExternalLink className="w-4 h-4" aria-hidden />
                        </a>
                    </div>
                </motion.div>
            </section>
        </div>
    )
}