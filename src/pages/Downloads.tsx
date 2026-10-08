import { getDownloads } from '@/lib/catalog'
import { safeUrl } from '@/lib/media'
import { useAsyncData } from '@/hooks/useAsyncData'
import { DataState } from '@/components/common/DataState'
import { motion } from 'framer-motion'
import { FileAudio, Music, Package, ExternalLink } from 'lucide-react'

const typeLabels: Record<string, { label: string; icon: typeof FileAudio }> = {
    'sample-pack': { label: 'Sample Pack', icon: Package },
    'preset': { label: 'Preset', icon: Music },
    'template': { label: 'Template / Guida', icon: FileAudio },
}

export default function Downloads() {
    const {data,loading,error,reload}=useAsyncData(getDownloads)
    const downloads=data||[]
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

            <DataState loading={loading} error={error} retry={reload}/>
            {!loading&&!error&&!downloads.length&&<p className="text-center text-ink-500">Le risorse saranno disponibili a breve.</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {downloads.map((item, i) => {
                    const TypeIcon = typeLabels[item.file_type]?.icon || FileAudio
                    return (
                        <motion.a
                            key={item.id}
                            href={safeUrl(item.file_url) || undefined}
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
                                        src={item.thumbnail_url || '/logo-dark.png'}
                                        alt=""
                                        aria-hidden
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        width={800}
                                        height={600}
                                    />
                                    <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ivory-50/95 backdrop-blur text-xs font-medium text-ink-700">
                                        <TypeIcon className="w-3.5 h-3.5" aria-hidden />
                                        {typeLabels[item.file_type]?.label}
                                    </span>
                                </div>
                                <div className="p-6">
                                    <h2 className="font-serif text-lg font-semibold">{item.title}</h2>
                                    <p className="mt-2 text-sm text-ink-500 leading-relaxed line-clamp-2">
                                        {item.description}
                                    </p>
                                    <div className="mt-4 flex items-center justify-between text-xs text-ink-400">
                                        <span>Risorsa gratuita</span>
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