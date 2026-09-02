import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

const registerSchema = z.object({
    fullName: z.string().min(2, 'Inserisci il tuo nome completo'),
    email: z.string().email('Email non valida'),
    password: z
        .string()
        .min(8, 'La password deve avere almeno 8 caratteri')
        .regex(/[A-Z]/, 'Deve contenere almeno una lettera maiuscola')
        .regex(/[0-9]/, 'Deve contenere almeno un numero'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Le password non coincidono',
    path: ['confirmPassword'],
})

type RegisterForm = z.infer<typeof registerSchema>

export default function Register() {
    const { signUp, user } = useAuthStore()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const redirect = searchParams.get('redirect') || '/dashboard'

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    })

    useEffect(() => {
        if (user) navigate(redirect, { replace: true })
    }, [user, redirect, navigate])

    const onSubmit = async (data: RegisterForm) => {
        setIsLoading(true)
        setFormError(null)
        const { error } = await signUp(data.email, data.password, data.fullName)
        setIsLoading(false)

        if (error) {
            setFormError(
                error.message.includes('already registered')
                    ? 'Questa email è già registrata. Prova ad accedere.'
                    : error.message.includes('Password')
                        ? error.message
                        : 'Errore durante la registrazione. Riprova.'
            )
        } else {
            setSuccess(true)
        }
    }

    return (
        <div className="container-site py-16 lg:py-24">
            <div className="max-w-md mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <p className="eyebrow mb-3">Benvenuto</p>
                    <h1 className="font-serif text-3xl lg:text-4xl font-semibold">
                        Crea il tuo <span className="italic text-wine-700">account</span>
                    </h1>
                    <p className="mt-3 text-ink-500 text-sm">
                        Un account per acquistare corsi, seguire i progressi e accedere ai materiali.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card p-8"
                >
                    {success ? (
                        <div className="text-center space-y-4" role="status">
                            <div className="w-14 h-14 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto text-2xl font-serif">
                                ✓
                            </div>
                            <h2 className="font-serif text-xl font-semibold">Registrazione completata</h2>
                            <p className="text-sm text-ink-500">
                                Ti abbiamo inviato un'email di conferma. Clicca sul link per attivare
                                l'account, poi accedi.
                            </p>
                            <Link to="/login" className="btn-primary w-full">
                                Vai al login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                            {formError && (
                                <div role="alert" className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                                    {formError}
                                </div>
                            )}

                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-ink-700 mb-1.5">
                                    Nome completo
                                </label>
                                <input
                                    {...register('fullName')}
                                    type="text"
                                    id="fullName"
                                    autoComplete="name"
                                    className="input-field"
                                    placeholder="Mario Rossi"
                                />
                                {errors.fullName && (
                                    <p className="mt-1.5 text-sm text-red-600">{errors.fullName.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-ink-700 mb-1.5">
                                    Email
                                </label>
                                <input
                                    {...register('email')}
                                    type="email"
                                    id="email"
                                    autoComplete="email"
                                    className="input-field"
                                    placeholder="tu@email.it"
                                />
                                {errors.email && (
                                    <p className="mt-1.5 text-sm text-red-600">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-ink-700 mb-1.5">
                                    Password
                                </label>
                                <input
                                    {...register('password')}
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    className="input-field"
                                    placeholder="Almeno 8 caratteri, 1 maiuscola, 1 numero"
                                />
                                {errors.password && (
                                    <p className="mt-1.5 text-sm text-red-600">{errors.password.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-ink-700 mb-1.5">
                                    Conferma password
                                </label>
                                <input
                                    {...register('confirmPassword')}
                                    type="password"
                                    id="confirmPassword"
                                    autoComplete="new-password"
                                    className="input-field"
                                    placeholder="••••••••"
                                />
                                {errors.confirmPassword && (
                                    <p className="mt-1.5 text-sm text-red-600">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <button type="submit" disabled={isLoading} className="btn-primary w-full disabled:opacity-60">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                                        Registrazione in corso…
                                    </>
                                ) : (
                                    'Crea account'
                                )}
                            </button>

                            <p className="text-center text-sm text-ink-500">
                                Hai già un account?{' '}
                                <Link to="/login" className="text-wine-700 font-medium underline underline-offset-2 hover:no-underline">
                                    Accedi
                                </Link>
                            </p>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    )
}