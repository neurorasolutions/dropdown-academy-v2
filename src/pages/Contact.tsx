import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Mail, MapPin, Clock, Loader2, Send, CheckCircle2 } from 'lucide-react'
import { supabase, isDemoMode } from '@/lib/supabase'

const contactSchema = z.object({
    name: z.string().min(2, 'Inserisci il tuo nome'),
    email: z.string().email('Email non valida'),
    subject: z.string().min(3, 'Inserisci un oggetto'),
    message: z.string().min(10, 'Il messaggio deve avere almeno 10 caratteri'),
})

type ContactForm = z.infer<typeof contactSchema>

const contactInfo = [
    { icon: Mail, label: 'Email', value: 'info@dropdownacademy.com', href: 'mailto:info@dropdownacademy.com' },
    { icon: MapPin, label: 'Studio', value: 'Musical Box Studio, Vigevano (PV)', href: null },
    { icon: Clock, label: 'Risposta', value: 'Entro 1 giorno lavorativo', href: null },
]

export default function Contact() {
    const [isSent, setIsSent] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const [sendError, setSendError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactForm>({
        resolver: zodResolver(contactSchema),
    })

    const onSubmit = async (data: ContactForm) => {
        setIsSending(true)
        setSendError(null)

        try {
            if (!isDemoMode) {
                const { error } = await (supabase.from('dropdown_contact_messages') as any).insert({
                    name: data.name,
                    email: data.email,
                    subject: data.subject,
                    message: data.message,
                })
                if (error) throw error
            }
            setIsSent(true)
            reset()
        } catch (e) {
            setSendError('Impossibile inviare il messaggio. Riprova o scrivici via email.')
            console.error('Contact form error:', e)
        } finally {
            setIsSending(false)
        }
    }

    return (
        <div className="container-site py-12 lg:py-20">
            <header className="text-center max-w-2xl mx-auto mb-14">
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="eyebrow mb-3"
                >
                    Parliamone
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="section-title"
                >
                    Contattaci
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mt-4 text-ink-500 leading-relaxed"
                >
                    Domande sui corsi, iscrizioni in presenza o semplici curiosità:
                    ti rispondiamo al più presto.
                </motion.p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
                {/* Info */}
                <motion.aside
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="space-y-6"
                >
                    {contactInfo.map((info) => (
                        <div key={info.label} className="flex items-start gap-4">
                            <span className="w-11 h-11 rounded-full bg-wine-700/10 text-wine-700 flex items-center justify-center shrink-0">
                                <info.icon className="w-5 h-5" aria-hidden />
                            </span>
                            <div>
                                <h2 className="text-sm font-medium text-ink-900">{info.label}</h2>
                                {info.href ? (
                                    <a href={info.href} className="text-sm text-ink-500 hover:text-wine-700 transition-colors">
                                        {info.value}
                                    </a>
                                ) : (
                                    <p className="text-sm text-ink-500">{info.value}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </motion.aside>

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2"
                >
                    <div className="card p-8">
                        {isSent ? (
                            <div className="text-center py-8 space-y-4" role="status">
                                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" aria-hidden />
                                <h2 className="font-serif text-2xl font-semibold">Messaggio inviato</h2>
                                <p className="text-ink-500">
                                    Grazie per averci scritto: ti risponderemo entro un giorno lavorativo.
                                </p>
                                <button onClick={() => setIsSent(false)} className="btn-secondary">
                                    Invia un altro messaggio
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                                {sendError && (
                                    <div role="alert" className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                                        {sendError}
                                    </div>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-ink-700 mb-1.5">
                                            Nome
                                        </label>
                                        <input {...register('name')} type="text" id="name" className="input-field" placeholder="Il tuo nome" />
                                        {errors.name && <p className="mt-1.5 text-sm text-red-600">{errors.name.message}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-ink-700 mb-1.5">
                                            Email
                                        </label>
                                        <input {...register('email')} type="email" id="email" autoComplete="email" className="input-field" placeholder="tu@email.it" />
                                        {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email.message}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-ink-700 mb-1.5">
                                        Oggetto
                                    </label>
                                    <input {...register('subject')} type="text" id="subject" className="input-field" placeholder="Di cosa vuoi parlare?" />
                                    {errors.subject && <p className="mt-1.5 text-sm text-red-600">{errors.subject.message}</p>}
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-ink-700 mb-1.5">
                                        Messaggio
                                    </label>
                                    <textarea
                                        {...register('message')}
                                        id="message"
                                        rows={6}
                                        className="input-field resize-y"
                                        placeholder="Scrivici…"
                                    />
                                    {errors.message && <p className="mt-1.5 text-sm text-red-600">{errors.message.message}</p>}
                                </div>
                                <button type="submit" disabled={isSending} className="btn-primary disabled:opacity-60">
                                    {isSending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                                            Invio in corso…
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" aria-hidden />
                                            Invia messaggio
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}