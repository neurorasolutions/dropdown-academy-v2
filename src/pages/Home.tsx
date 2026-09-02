import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Infinity as InfinityIcon, MessageCircle, Award, PlayCircle } from 'lucide-react'
import { useRef } from 'react'
import { coursesData } from '@/data/courses'

const featuredCourses = Object.values(coursesData).slice(0, 3)

const testimonials = [
    {
        name: 'Federico Zanrei',
        role: 'Studente',
        content: 'Ottime spiegazioni, dalla A alla Z. Quello che non trovi nemmeno nelle masterclass "ad alto costo". Un principiante deve avere l\'opportunità di conoscere come funziona il tutto, senza tecnicismi inutili e video frettolosi.',
    },
    {
        name: 'Gianluca Correnti',
        role: 'Studente',
        content: 'Una meraviglia.',
    },
    {
        name: 'Emmanuel Dell\'Acqueva',
        role: 'Studente',
        content: 'Il docente è molto bravo, preparato e pragmatico.',
    },
    {
        name: 'Carlo Valenti',
        role: 'Studente',
        content: 'Docenti super preparati e una masterclass davvero interessante!',
    },
    {
        name: 'Luciano Carlacchiani',
        role: 'Studente',
        content: 'Mi sono trovato benissimo a seguire i loro corsi e credo che ne prenderò altri.',
    },
    {
        name: 'Carlo Valenti',
        role: 'Studente',
        content: 'Prima di tutto persona squisita poi anche grande professionista del mixer e dei suoni. Volete portare la vostra produzione ad un livello top? Con lui andate a colpo sicuro!',
    },
]

const principles = [
    {
        icon: Award,
        title: 'Eccellenza didattica',
        description: 'Percorsi strutturati da professionisti attivi nel settore: nessun tecnicismo inutile, nessuna lezione frettolosa.',
    },
    {
        icon: InfinityIcon,
        title: 'Accesso per sempre',
        description: 'Ogni corso acquistato resta tuo: lezioni in streaming, aggiornamenti inclusi e materiali scaricabili.',
    },
    {
        icon: MessageCircle,
        title: 'Supporto reale',
        description: 'Dubbi e domande hanno una risposta. Affiancamento diretto e una community che cresce con te.',
    },
]

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.5, ease: 'easeOut' as const },
}

export default function Home() {
    const heroRef = useRef<HTMLDivElement>(null)

    return (
        <div>
            {/* ─── Hero ─── */}
            <section className="relative overflow-hidden bg-wine-950 text-ivory-50" ref={heroRef}>
                {/* texture radiale */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            'radial-gradient(ellipse 80% 60% at 70% 10%, rgba(212,175,106,0.12), transparent 60%), radial-gradient(ellipse 60% 50% at 20% 90%, rgba(87,31,46,0.5), transparent 65%)',
                    }}
                    aria-hidden
                />
                <div className="container-site relative py-24 lg:py-36">
                    <div className="max-w-3xl">
                        <motion.p
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="eyebrow text-brass-400 mb-6"
                        >
                            Sound Design · Produzione Musicale
                        </motion.p>
                        <motion.h1
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.1 }}
                            className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] font-medium"
                        >
                            Il suono che hai in testa,
                            <br />
                            <span className="italic text-brass-300">impari a costruirlo.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.2 }}
                            className="mt-6 text-lg text-ivory-200/80 leading-relaxed max-w-xl"
                        >
                            Corsi online e masterclass in presenza per chi vuole padroneggiare
                            la sintesi, il mixaggio e la produzione — con metodo, profondità
                            e senza scorciatoie.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.3 }}
                            className="mt-10 flex flex-wrap gap-4"
                        >
                            <Link to="/courses" className="btn-primary bg-brass-400 text-wine-950 hover:bg-brass-300">
                                Scopri i corsi
                                <ArrowRight className="w-4 h-4" aria-hidden />
                            </Link>
                            <Link
                                to="/in-presenza"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-ivory-200/30 text-ivory-50 font-medium transition-all duration-200 hover:border-ivory-200/60 hover:bg-ivory-50/5 cursor-pointer"
                            >
                                <PlayCircle className="w-4 h-4" aria-hidden />
                                Formazione in presenza
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ─── Numeri ─── */}
            <section className="bg-ivory-50 border-b border-ivory-300">
                <div className="container-site py-12">
                    <dl className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        {[
                            { value: '6+', label: 'Corsi completi' },
                            { value: '150+', label: 'Lezioni video' },
                            { value: '60h+', label: 'Didattica' },
                            { value: '9', label: 'Moduli in presenza' },
                        ].map((stat) => (
                            <div key={stat.label}>
                                <dt className="sr-only">{stat.label}</dt>
                                <dd className="font-serif text-3xl lg:text-4xl font-semibold text-wine-700 tabular-nums">
                                    {stat.value}
                                </dd>
                                <p className="mt-1 text-sm text-ink-500">{stat.label}</p>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>

            {/* ─── Corsi in evidenza ─── */}
            <section className="container-site py-20 lg:py-28">
                <motion.div {...fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <p className="eyebrow mb-3">Il catalogo</p>
                        <h2 className="section-title">
                            Corsi pensati per <span className="italic text-wine-700">far crescere</span> il tuo suono
                        </h2>
                    </div>
                    <Link to="/courses" className="btn-secondary shrink-0">
                        Vedi tutti i corsi
                        <ArrowRight className="w-4 h-4" aria-hidden />
                    </Link>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredCourses.map((course, i) => (
                        <motion.div
                            key={course.slug}
                            {...fadeUp}
                            transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                        >
                            <Link to={`/courses/${course.slug}`} className="group block">
                                <article className="card transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lift">
                                    <div className="aspect-[4/3] overflow-hidden bg-ivory-200">
                                        <img
                                            src={course.thumbnail}
                                            alt={course.title}
                                            loading="lazy"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            width={800}
                                            height={600}
                                        />
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-start justify-between gap-4">
                                            <h3 className="font-serif text-xl font-semibold leading-snug">
                                                {course.title}
                                            </h3>
                                            <span className="shrink-0 font-serif text-lg font-semibold text-wine-700 tabular-nums">
                                                €{course.price}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm text-ink-500 leading-relaxed line-clamp-2">
                                            {course.description}
                                        </p>
                                        <div className="mt-4 flex items-center gap-4 text-xs text-ink-400">
                                            <span>{course.lessonsCount} lezioni</span>
                                            <span aria-hidden>·</span>
                                            <span>{course.duration}</span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ─── Perché Dropdown ─── */}
            <section className="bg-ivory-50 border-y border-ivory-300">
                <div className="container-site py-20 lg:py-28">
                    <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
                        <p className="eyebrow mb-3">Il metodo</p>
                        <h2 className="section-title">
                            Una scuola, <span className="italic text-wine-700">non una playlist</span>
                        </h2>
                        <p className="mt-4 text-ink-500 leading-relaxed">
                            Ogni corso nasce da un percorso didattico vero: lezioni che si costruiscono
                            l'una sull'altra, materiali inclusi e un docente che risponde.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {principles.map((p, i) => (
                            <motion.div
                                key={p.title}
                                {...fadeUp}
                                transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                                className="text-center px-6"
                            >
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-wine-700/10 text-wine-700 mb-5">
                                    <p.icon className="w-6 h-6" aria-hidden />
                                </div>
                                <h3 className="font-serif text-xl font-semibold mb-3">{p.title}</h3>
                                <p className="text-sm text-ink-500 leading-relaxed">{p.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Citazione ─── */}
            <section className="container-site py-20 lg:py-28">
                <motion.blockquote
                    {...fadeUp}
                    className="max-w-3xl mx-auto text-center"
                >
                    <p className="font-serif text-2xl lg:text-3xl italic leading-relaxed text-ink-900">
                        "Un principiante deve avere l'opportunità di conoscere come funziona il tutto,
                        senza tecnicismi inutili e video frettolosi."
                    </p>
                    <footer className="mt-6 text-sm text-ink-500">
                        — Federico, studente Dropdown Academy
                    </footer>
                </motion.blockquote>
            </section>

            {/* ─── Testimonianze ─── */}
            <section className="bg-ivory-50 border-y border-ivory-300">
                <div className="container-site py-20 lg:py-28">
                    <motion.div {...fadeUp} className="text-center mb-14">
                        <p className="eyebrow mb-3">Dicono di noi</p>
                        <h2 className="section-title">Gli studenti parlano</h2>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <motion.figure
                                key={t.name}
                                {...fadeUp}
                                transition={{ ...fadeUp.transition, delay: (i % 3) * 0.08 }}
                                className="card p-6"
                            >
                                <div className="flex gap-0.5 mb-4" aria-label="Valutazione: 5 su 5">
                                    {Array.from({ length: 5 }).map((_, s) => (
                                        <svg key={s} className="w-4 h-4 text-brass-500 fill-current" viewBox="0 0 20 20" aria-hidden>
                                            <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.35 4.15a1 1 0 0 0 .95.69h4.24c.97 0 1.37 1.24.59 1.81l-3.43 2.49a1 1 0 0 0-.36 1.12l1.34 4.12c.3.92-.75 1.69-1.54 1.12l-3.42-2.49a1 1 0 0 0-1.18 0l-3.42 2.49c-.79.57-1.84-.2-1.54-1.12l1.34-4.12a1 1 0 0 0-.36-1.12L2.02 10.08c-.78-.57-.38-1.81.59-1.81h4.24a1 1 0 0 0 .95-.69l1.2-4.34z" />
                                        </svg>
                                    ))}
                                </div>
                                <blockquote className="text-sm text-ink-700 leading-relaxed">
                                    {t.content}
                                </blockquote>
                                <figcaption className="mt-4 text-sm">
                                    <span className="font-medium">{t.name}</span>
                                    <span className="text-ink-400"> · {t.role}</span>
                                </figcaption>
                            </motion.figure>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA finale ─── */}
            <section className="container-site py-20 lg:py-28">
                <motion.div
                    {...fadeUp}
                    className="bg-wine-950 text-ivory-50 rounded-3xl px-8 py-16 lg:px-20 text-center relative overflow-hidden"
                >
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background:
                                'radial-gradient(ellipse 60% 70% at 50% 120%, rgba(212,175,106,0.18), transparent 70%)',
                        }}
                        aria-hidden
                    />
                    <div className="relative">
                        <h2 className="font-serif text-3xl lg:text-4xl font-medium">
                            Pronto a fare il <span className="italic text-brass-300">salto di qualità</span>?
                        </h2>
                        <p className="mt-4 text-ivory-200/80 max-w-xl mx-auto">
                            Scegli il tuo percorso: online quando vuoi, in presenza per
                            un'esperienza completa in studio.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <Link to="/courses" className="btn-primary bg-brass-400 text-wine-950 hover:bg-brass-300">
                                Corsi online
                            </Link>
                            <Link
                                to="/in-presenza"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-ivory-200/30 text-ivory-50 font-medium transition-all duration-200 hover:border-ivory-200/60 hover:bg-ivory-50/5 cursor-pointer"
                            >
                                Corsi in presenza
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    )
}