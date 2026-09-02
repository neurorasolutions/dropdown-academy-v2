import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Clock, Users, Download, ArrowRight } from 'lucide-react'

const highlights = [
    { icon: Clock, title: 'Corsi online on-demand', description: 'Studia quando vuoi' },
    { icon: Users, title: 'Laboratori & Masterclass', description: 'Esperienza hands-on' },
    { icon: GraduationCapIcon, title: 'Percorso annuale', description: 'Formazione completa' },
    { icon: Users, title: 'Community attiva', description: 'Confronto continuo' },
]

const modules = [
    { num: 1, title: 'Acustica e Teoria Tecnica', desc: 'Fisica del suono, propagazione, risonanze, percezione uditiva, psicoacustica e allestimento acustico di uno studio.' },
    { num: 2, title: 'Fondamenti di Teoria Musicale', desc: 'Armonia base, scale, accordi, evoluzioni ritmiche e trascrizione per una composizione cosciente.' },
    { num: 3, title: 'Teoria dei Segnali e Informatica', desc: 'Segnali analogici e digitali, campionamento, bit depth, protocollo MIDI ed informatica applicata alla musica.' },
    { num: 4, title: 'Utilizzo di DAW (Logic Pro)', desc: 'Flusso di lavoro, shortcuts, arrangiamento, registrazioni multitraccia, routing e configurazione del software.' },
    { num: 5, title: 'Tecniche di Mixaggio', desc: 'Gain staging, equalizzazione, compressione, effetti spaziali (riverberi, delay) e bilanciamento delle tracce.' },
    { num: 6, title: 'Sound Design', desc: 'Sintesi sottrattiva, FM, wavetable, granulare. Utilizzo di sintetizzatori hardware/software ed editor audio.' },
    { num: 7, title: 'Laboratorio Recording/Mixing Full Analog', desc: 'Lavoro pratico in studio con banco analogico, microfonazione multitraccia e outboard di pregio.' },
    { num: 8, title: 'Tecniche di Mastering', desc: 'Ottimizzazione del loudness, equalizzazione correttiva, limiter, standard di pubblicazione e formati di esportazione.' },
    { num: 9, title: 'Stage & Affiancamento', desc: 'Sessioni pratiche in studio affiancando professionisti su progetti di produzione e mixaggio reali.' },
]

function GraduationCapIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
    )
}

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.5, ease: 'easeOut' as const },
}

export default function InPersonCourses() {
    return (
        <div>
            {/* Hero */}
            <section className="bg-wine-950 text-ivory-50">
                <div className="container-site py-20 lg:py-28">
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
                        <p className="eyebrow text-brass-400 mb-4">Vigevano (PV) · Musical Box Studio</p>
                        <h1 className="font-serif text-4xl lg:text-6xl font-medium leading-tight">
                            Corsi <span className="italic text-brass-300">in presenza</span>
                        </h1>
                        <p className="mt-6 text-lg text-ivory-200/80 leading-relaxed max-w-2xl">
                            Un anno accademico dentro uno studio professionale: teoria, pratica
                            analogica e affiancamento reale su progetti di produzione.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <a href="#programma" className="btn-primary bg-brass-400 text-wine-950 hover:bg-brass-300">
                                Scopri il programma
                            </a>
                            <a
                                href="#richiedi-info"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-ivory-200/30 text-ivory-50 font-medium transition-all duration-200 hover:border-ivory-200/60 hover:bg-ivory-50/5 cursor-pointer"
                            >
                                Richiedi informazioni
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Intro con immagine */}
            <section className="container-site py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:items-center">
                    <motion.div {...fadeUp}>
                        <img
                            src="/images/studio-in-presenza.jpg"
                            alt="Lezione in studio di produzione musicale presso Dropdown Academy"
                            loading="lazy"
                            className="w-full h-auto rounded-2xl shadow-lift object-cover"
                            width={548}
                            height={1024}
                        />
                    </motion.div>
                    <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
                        <p className="eyebrow mb-3">Il luogo</p>
                        <h2 className="section-title mb-6">
                            Un anno dentro <span className="italic text-wine-700">uno studio vero</span>
                        </h2>
                        <p className="text-ink-700 leading-relaxed mb-6">
                            Drop Down Academy è il punto di riferimento per lo studio avanzato del
                            Sound Design e della produzione musicale. Offriamo corsi strutturati,
                            contenuti esclusivi e una community attiva di professionisti e appassionati.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-wine-700 mt-0.5 shrink-0" aria-hidden />
                                <div>
                                    <p className="font-medium">Musical Box Studio</p>
                                    <p className="text-sm text-ink-500">Vigevano (PV) — sale attrezzate con banco analogico e outboard di pregio</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-wine-700 mt-0.5 shrink-0" aria-hidden />
                                <div>
                                    <p className="font-medium">Anno accademico</p>
                                    <p className="text-sm text-ink-500">9 moduli, dal fondamento teorico allo stage pratico</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Users className="w-5 h-5 text-wine-700 mt-0.5 shrink-0" aria-hidden />
                                <div>
                                    <p className="font-medium">Gruppi ridotti</p>
                                    <p className="text-sm text-ink-500">Attenzione reale a ogni studente, dalla teoria alla sessione in studio</p>
                                </div>
                            </li>
                        </ul>
                    </motion.div>
                </div>
            </section>

            {/* Highlights */}
            <section className="bg-ivory-50 border-y border-ivory-300">
                <div className="container-site py-16">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {highlights.map((h, i) => (
                            <motion.div
                                key={h.title}
                                {...fadeUp}
                                transition={{ ...fadeUp.transition, delay: i * 0.06 }}
                                className="text-center"
                            >
                                <div className="inline-flex w-12 h-12 rounded-full bg-wine-700/10 text-wine-700 items-center justify-center mb-4">
                                    <h.icon className="w-5 h-5" aria-hidden />
                                </div>
                                <h3 className="font-serif text-lg font-semibold">{h.title}</h3>
                                <p className="text-sm text-ink-500 mt-1">{h.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Programma */}
            <section id="programma" className="container-site py-20 lg:py-28 scroll-mt-24">
                <motion.div {...fadeUp} className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="eyebrow mb-3">Il percorso</p>
                        <h2 className="section-title">I 9 moduli del programma</h2>
                    </div>
                    <ol className="space-y-4">
                        {modules.map((mod) => (
                            <li key={mod.num} className="card p-6 flex gap-5">
                                <span className="font-serif text-2xl text-brass-500 tabular-nums shrink-0 w-8" aria-hidden>
                                    {String(mod.num).padStart(2, '0')}
                                </span>
                                <div>
                                    <h3 className="font-medium text-ink-900">{mod.title}</h3>
                                    <p className="text-sm text-ink-500 leading-relaxed mt-1">{mod.desc}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                    <div className="mt-8 card p-6 bg-wine-950 text-ivory-50 border-wine-950">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <p className="eyebrow text-brass-300 mb-1">Corso annuale</p>
                                <p className="font-serif text-2xl font-semibold">Produzione e Sound Design</p>
                                <p className="text-sm text-ivory-200/70 mt-1">
                                    1 anno accademico · Musical Box Studio, Vigevano
                                </p>
                            </div>
                            <Link to="/contact" className="btn-primary bg-brass-400 text-wine-950 hover:bg-brass-300 shrink-0">
                                Richiedi il programma
                                <ArrowRight className="w-4 h-4" aria-hidden />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* CTA brochure + contatto */}
            <section id="richiedi-info" className="bg-ivory-50 border-t border-ivory-300 scroll-mt-20">
                <div className="container-site py-16 text-center max-w-2xl">
                    <h2 className="font-serif text-3xl font-semibold mb-4">
                        Ti serve <span className="italic text-wine-700">qualcosa in più</span>?
                    </h2>
                    <p className="text-ink-500 mb-8">
                        Scarica la brochure con il programma dettagliato e i costi, o scrivici
                        direttamente: ti ricontattiamo entro un giorno lavorativo.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="#"
                            onClick={(e) => e.preventDefault()}
                            className="btn-secondary"
                            aria-label="Scarica la brochure del corso (link in arrivo)"
                        >
                            <Download className="w-4 h-4" aria-hidden />
                            Scarica la brochure
                        </a>
                        <Link to="/contact" className="btn-primary">
                            Contattaci
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}