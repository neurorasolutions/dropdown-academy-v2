import { motion } from 'framer-motion'
import { FileAudio, Music, Package, ExternalLink } from 'lucide-react'

const downloads = [
    {
        id: '1',
        title: 'Dubstep Drum Kit',
        description: 'Dubstep Drum Kit per qualsiasi DAW. Campioni di batteria ed effetti di alta qualità pronti all\'uso.',
        fileType: 'sample-pack' as const,
        fileSize: 'Via Gumroad',
        downloads: '1.420',
        thumbnail: '/images/downloads/dubstep_drum_kit.jpg',
        downloadUrl: 'https://dropdownacademy.gumroad.com/l/dubstepdrumkit',
    },
    {
        id: '2',
        title: 'House Drum Kit',
        description: 'House Drum Kit per qualsiasi DAW. Cassa, rullanti, hi-hat e loop ideali per produzioni house.',
        fileType: 'sample-pack' as const,
        fileSize: 'Via Gumroad',
        downloads: '2.315',
        thumbnail: '/images/downloads/house_drum_kit.jpg',
        downloadUrl: 'https://dropdownacademy.gumroad.com/l/HouseDrumKit',
    },
    {
        id: '3',
        title: 'Serum Preset Pack - Synthwave',
        description: 'Preset Pack di Synthwave e retrowave avanzati per il sintetizzatore Serum.',
        fileType: 'preset' as const,
        fileSize: '7.8 MB',
        downloads: '1.845',
        thumbnail: '/images/downloads/synthwave_presets.jpg',
        downloadUrl: 'https://drive.google.com/file/d/1m4JzUWSt9v0MpLNRktsQKv8EDu-2tsrC/view?usp=sharing',
    },
    {
        id: '4',
        title: 'Vital Preset Pack',
        description: 'Pack di preset professionali e sonorità moderne per il sintetizzatore gratuito Vital.',
        fileType: 'preset' as const,
        fileSize: '5.2 MB',
        downloads: '3.200',
        thumbnail: '/images/downloads/vital_presets.jpg',
        downloadUrl: 'https://drive.google.com/file/d/1NQAQfFC0sAmmWMfHwn83aaaOJ5ZiaKiM/view?usp=sharing',
    },
    {
        id: '5',
        title: 'Moog Model D Plugin per Reaktor',
        description: 'Emulazione software del leggendario sintetizzatore Moog Model D costruita interamente in Reaktor.',
        fileType: 'template' as const,
        fileSize: '4.1 MB',
        downloads: '987',
        thumbnail: '/images/downloads/moog_model_d.jpg',
        downloadUrl: 'https://drive.google.com/file/d/171E20oK3-eHw2OONLk479LlXU-5bsf19/view?usp=sharing',
    },
    {
        id: '6',
        title: 'Korg MS-20 Plugin per Reaktor',
        description: 'Emulazione software del classico sintetizzatore semi-modulare Korg MS-20 in Reaktor.',
        fileType: 'template' as const,
        fileSize: '3.8 MB',
        downloads: '1.120',
        thumbnail: '/images/downloads/korg_ms20.jpg',
        downloadUrl: 'https://drive.google.com/file/d/1tghrXU5uCfAro2TTXSF4mMjxt2fOygGM/view?usp=sharing',
    },
    {
        id: '7',
        title: 'Guida Pratica Costruzione 808 Bass',
        description: 'Guida pdf completa + sample pack per imparare a sintetizzare e processare bassi 808 professionali.',
        fileType: 'template' as const,
        fileSize: '15.4 MB',
        downloads: '4.120',
        thumbnail: '/images/downloads/guida_808.jpg',
        downloadUrl: 'https://drive.google.com/file/d/1BhPgNm4PBAoQ1bR289nWPv7lteJbLA6E/view?usp=sharing',
    },
]

const typeLabels: Record<string, { label: string; icon: typeof FileAudio }> = {
    'sample-pack': { label: 'Sample Pack', icon: Package },
    'preset': { label: 'Preset', icon: Music },
    'template': { label: 'Template / Guida', icon: FileAudio },
}

export default function Downloads() {
    return (
        <div className="container-site py-12 lg:py-20">
            <header className="text-center max-w-2xl mx-auto mb-14">
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="eyebrow mb-3"
                >
                    Risorse gratuite
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="section-title"
                >
                    Download <span className="italic text-wine-700">gratuiti</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mt-4 text-ink-500 leading-relaxed"
                >
                    Preset, sample pack e strumenti costruiti da noi, liberamente scaricabili.
                </motion.p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {downloads.map((item, i) => {
                    const TypeIcon = typeLabels[item.fileType]?.icon || FileAudio
                    return (
                        <motion.a
                            key={item.id}
                            href={item.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ delay: (i % 3) * 0.06 }}
                            className="group block"
                            aria-label={`Scarica ${item.title}`}
                        >
                            <article className="card h-full transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lift">
                                <div className="aspect-[4/3] overflow-hidden bg-ivory-200 relative">
                                    <img
                                        src={item.thumbnail}
                                        alt=""
                                        aria-hidden
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        width={800}
                                        height={600}
                                    />
                                    <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ivory-50/95 backdrop-blur text-xs font-medium text-ink-700">
                                        <TypeIcon className="w-3.5 h-3.5" aria-hidden />
                                        {typeLabels[item.fileType]?.label}
                                    </span>
                                </div>
                                <div className="p-6">
                                    <h2 className="font-serif text-lg font-semibold">{item.title}</h2>
                                    <p className="mt-2 text-sm text-ink-500 leading-relaxed line-clamp-2">
                                        {item.description}
                                    </p>
                                    <div className="mt-4 flex items-center justify-between text-xs text-ink-400">
                                        <span>{item.fileSize} · {item.downloads} download</span>
                                        <span className="inline-flex items-center gap-1.5 font-medium text-wine-700">
                                            Scarica
                                            <ExternalLink className="w-3.5 h-3.5" aria-hidden />
                                        </span>
                                    </div>
                                </div>
                            </article>
                        </motion.a>
                    )
                })}
            </div>
        </div>
    )
}