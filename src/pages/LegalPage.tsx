import { motion } from 'framer-motion'

interface LegalPageProps {
    title: string
    subtitle: string
    sections: { heading: string; body: string[] }[]
}

export function LegalPage({ title, subtitle, sections }: LegalPageProps) {
    return (
        <div className="container-site py-12 lg:py-20">
            <div className="max-w-3xl mx-auto">
                <header className="mb-12">
                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="eyebrow mb-3"
                    >
                        {subtitle}
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="section-title"
                    >
                        {title}
                    </motion.h1>
                </header>
                <div className="space-y-10">
                    {sections.map((section, i) => (
                        <motion.section
                            key={section.heading}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.05 }}
                        >
                            <h2 className="font-serif text-xl font-semibold mb-3">{section.heading}</h2>
                            {section.body.map((paragraph, j) => (
                                <p key={j} className="text-ink-500 leading-relaxed mb-3">
                                    {paragraph}
                                </p>
                            ))}
                        </motion.section>
                    ))}
                </div>
                <p className="mt-14 text-xs text-ink-400">
                    Ultimo aggiornamento: Settembre 2026
                </p>
            </div>
        </div>
    )
}