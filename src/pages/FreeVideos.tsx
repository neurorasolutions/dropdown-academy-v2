import { motion } from 'framer-motion'
import { Play, ExternalLink, Youtube } from 'lucide-react'

const videoCategories = [
    {
        name: 'Sintesi & Strumenti Virtuali',
        videos: [
            { id: '1', title: 'Max MSP in ITALIANO! Corso completo! LEZIONE 2', youtubeId: 'yztEb-NRJmU', duration: '22:15', views: '1.9K' },
            { id: '2', title: 'Native Instruments Reaktor 6 - Come costruire un SYNTH!!!', youtubeId: 'czaHnwbd5dw', duration: '32:40', views: '2.4K' },
            { id: '3', title: 'Vital - Wavetable Synth | Tutorial ITALIANO', youtubeId: '8-h3I5J2680', duration: '18:20', views: '5.1K' },
            { id: '4', title: 'Pigments di Arturia : La guida completa in ITALIANO!', youtubeId: 'VaLO2E646K8', duration: '25:35', views: '6.3K' },
        ],
    },
    {
        name: 'Ableton Live & Sound Design',
        videos: [
            { id: '5', title: 'Ableton 02 - Editor Clip & Arrangiamento', youtubeId: 'E4M-nXJP7mo', duration: '16:24', views: '3.2K' },
            { id: '6', title: 'Come usare VCV rack ed Ableton insieme', youtubeId: 'XWvgygRCVTY', duration: '12:45', views: '2.1K' },
            { id: '7', title: 'Come costruire Drums in un brano Melodic Techno | Tutorial Ableton Live', youtubeId: 'sBibkGTcY1w', duration: '14:10', views: '4.8K' },
        ],
    },
    {
        name: 'One Synth One Song Challenge',
        videos: [
            { id: '8', title: 'Costruisco un intero brano con un sintetizzatore chiamato ANALOG!', youtubeId: 'ui72_pJVzQ4', duration: '29:10', views: '8.2K' },
            { id: '9', title: 'Costruisco un intero brano con un sintetizzatore chiamato OPERATOR!', youtubeId: 'hZbH7B8j7ko', duration: '34:50', views: '7.9K' },
        ],
    },
]

export default function FreeVideos() {
    return (
        <div className="container-site py-12 lg:py-20">
            {/* Header */}
            <header className="text-center max-w-2xl mx-auto mb-12">
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="eyebrow mb-3"
                >
                    Contenuti gratuiti
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="section-title"
                >
                    Tutorial <span className="italic text-wine-700">gratuiti</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mt-4 text-ink-500 leading-relaxed"
                >
                    Tutorial, tips e sfide creative dal nostro canale YouTube.
                    Inizia a imparare gratis.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mt-8"
                >
                    <a
                        href="https://youtube.com/@dropdownacademy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                    >
                        <Youtube className="w-5 h-5" aria-hidden />
                        Iscriviti al canale
                        <ExternalLink className="w-4 h-4" aria-hidden />
                    </a>
                </motion.div>
            </header>

            {/* Categorie */}
            <div className="space-y-16">
                {videoCategories.map((category) => (
                    <motion.section
                        key={category.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                    >
                        <h2 className="font-serif text-2xl font-semibold mb-8">
                            {category.name}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {category.videos.map((video) => (
                                <a
                                    key={video.id}
                                    href={`https://youtube.com/watch?v=${video.youtubeId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block"
                                    aria-label={`${video.title} — apre YouTube`}
                                >
                                    <article className="card transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lift">
                                        <div className="aspect-video relative bg-ivory-200 overflow-hidden">
                                            <img
                                                src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                                                alt={video.title}
                                                loading="lazy"
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                onError={(e) => {
                                                    e.currentTarget.src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`
                                                }}
                                                width={640}
                                                height={360}
                                            />
                                            <div
                                                className="absolute inset-0 bg-wine-950/20 group-hover:bg-wine-950/5 transition-colors flex items-center justify-center"
                                                aria-hidden
                                            >
                                                <span className="w-14 h-14 rounded-full bg-wine-950/80 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                                                    <Play className="w-6 h-6 text-ivory-50 fill-ivory-50" aria-hidden />
                                                </span>
                                            </div>
                                            <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-wine-950/85 text-ivory-50 text-xs tabular-nums">
                                                {video.duration}
                                            </span>
                                        </div>
                                        <div className="p-5">
                                            <h3 className="font-medium leading-snug line-clamp-2">{video.title}</h3>
                                            <p className="mt-2 text-xs text-ink-400">{video.views} visualizzazioni</p>
                                        </div>
                                    </article>
                                </a>
                            ))}
                        </div>
                    </motion.section>
                ))}
            </div>
        </div>
    )
}