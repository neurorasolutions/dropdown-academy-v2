import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
    return (
        <div className="container-site py-24 lg:py-32">
            <div className="max-w-lg mx-auto text-center">
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="eyebrow mb-4"
                >
                    Errore 404
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="font-serif text-5xl lg:text-6xl font-medium mb-6"
                >
                    Pagina <span className="italic text-wine-700">non trovata</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-ink-500 mb-8"
                >
                    La pagina che cerchi non esiste o è stata spostata.
                    Torna alla home o esplora il catalogo dei corsi.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex flex-wrap justify-center gap-4"
                >
                    <Link to="/" className="btn-primary">Torna alla home</Link>
                    <Link to="/courses" className="btn-secondary">Vedi i corsi</Link>
                </motion.div>
            </div>
        </div>
    )
}