import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqItems = [
    {
        question: 'Come funziona l\'accesso ai corsi?',
        answer: 'Una volta acquistato un videocorso, avrai accesso illimitato e lifetime ai contenuti. Puoi studiare secondo i tuoi ritmi, riprendendo le lezioni in qualsiasi momento e da qualsiasi dispositivo.',
    },
    {
        question: 'Di quale attrezzatura ho bisogno per seguire i corsi?',
        answer: 'Per i corsi online di Ableton Live, Serum o Pigments ti servirà un computer con installata la DAW o il synth relativo (anche in versione demo). Per i corsi di sintesi modulare o Reaktor, puoi iniziare anche solo con software gratuiti come VCV Rack o le versioni demo dei plugin.',
    },
    {
        question: 'I corsi rilasciano un attestato di partecipazione?',
        answer: 'Sì! Al completamento di tutte le lezioni di un corso premium, la piattaforma genererà automaticamente un attestato di completamento che potrai scaricare o inserire nel tuo portfolio.',
    },
    {
        question: 'È possibile scaricare i video delle lezioni?',
        answer: 'Per motivi di sicurezza e protezione del copyright, i video sono fruibili esclusivamente in streaming ad alta definizione sulla nostra piattaforma. Avrai invece accesso immediato al download di tutti i file di progetto, sample pack, preset e PDF allegati alle lezioni.',
    },
    {
        question: 'Come posso iscrivermi ai corsi in presenza a Vigevano?',
        answer: 'I corsi fisici si tengono presso il Musical Box Studio di Vigevano (PV). Puoi visualizzare il programma didattico nella pagina "In presenza" e inviare la richiesta di iscrizione tramite il modulo apposito. Ti ricontatteremo per confermare la disponibilità dei posti.',
    },
    {
        question: 'Quali sono i metodi di pagamento accettati?',
        answer: 'Accettiamo pagamenti sicuri tramite PayPal. Puoi pagare con il tuo conto PayPal o utilizzando le principali carte di credito e debito tramite il gateway di pagamento criptato integrato nel sito.',
    },
]

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    return (
        <div className="container-site py-12 lg:py-20">
            <header className="text-center max-w-2xl mx-auto mb-14">
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="eyebrow mb-3"
                >
                    Supporto
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="section-title"
                >
                    Domande <span className="italic text-wine-700">frequenti</span>
                </motion.h1>
            </header>

            <div className="max-w-3xl mx-auto space-y-3">
                {faqItems.map((item, index) => {
                    const isOpen = openIndex === index
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.04 }}
                        >
                            <div className="card">
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
                                    aria-expanded={isOpen}
                                    aria-controls={`faq-answer-${index}`}
                                >
                                    <span className="font-medium text-ink-900">{item.question}</span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-ink-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                                        aria-hidden
                                    />
                                </button>
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            id={`faq-answer-${index}`}
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                                            className="overflow-hidden"
                                        >
                                            <p className="px-6 pb-6 text-ink-500 leading-relaxed">
                                                {item.answer}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}