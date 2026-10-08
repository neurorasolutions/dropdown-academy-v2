import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import { GoogleButton } from '@/components/common/GoogleButton'

const loginSchema = z.object({
    email: z.string().email('Email non valida'),
    password: z.string().min(6, 'La password deve avere almeno 6 caratteri'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function Login() {
    const { signIn, user } = useAuthStore()
    const navigate = useNavigate()
    const location = useLocation()
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)

    const requested = new URLSearchParams(location.search).get('redirect') || (location.state as { from?: string })?.from || '/dashboard'
    const from = /^\/(?![\\/])/.test(requested) ? requested : '/dashboard'
    const [resetMessage,setResetMessage]=useState('')

    const {
        register,
        getValues,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    })

    useEffect(() => {
        if (user) navigate(from, { replace: true })
    }, [user, from, navigate])

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true)
        setFormError(null)
        const { error } = await signIn(data.email, data.password)
        setIsLoading(false)

        if (error) {
            setFormError(
                error.message.includes('Invalid login')
                    ? 'Email o password non corretti.'
                    : 'Errore durante l\'accesso. Riprova.'
            )
        } else {
            navigate(from, { replace: true })
        }
    }

    async function resetPassword() {
        const email=getValues('email')
        if(!z.string().email().safeParse(email).success){setResetMessage('Inserisci prima la tua email.');return}
        setIsLoading(true)
        try {const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:`${window.location.origin}/reset-password`});if(error)throw error;setResetMessage('Se l’indirizzo è registrato, riceverai un link per reimpostare la password.')}
        catch {setResetMessage('Invio non riuscito. Riprova più tardi.')}
        finally {setIsLoading(false)}
    }
    return (
        <div className="container-site py-16 lg:py-24">
            <div className="max-w-md mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <p className="eyebrow mb-3">Bentornato</p>
                    <h1 className="font-serif text-3xl lg:text-4xl font-semibold">
                        Accedi al tuo <span className="italic text-wine-700">spazio</span>
                    </h1>
                </motion.div>

                <motion.form
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="card p-8 space-y-5"
                    noValidate
                >
                    {formError && (
                        <div role="alert" className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                            {formError}
                        </div>
                    )}

                    <GoogleButton redirect={from} />

                    <div className="flex items-center gap-3" aria-hidden>
                        <span className="h-px flex-1 bg-ivory-300" />
                        <span className="text-xs text-ink-400 uppercase tracking-widest2">oppure</span>
                        <span className="h-px flex-1 bg-ivory-300" />
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
                        <div className="relative">
                            <input
                                {...register('password')}
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
                                className="input-field pr-12"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ink-400 hover:text-ink-700 cursor-pointer"
                                aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1.5 text-sm text-red-600">{errors.password.message}</p>
                        )}
                    </div>

                    <button type="submit" disabled={isLoading} className="btn-primary w-full disabled:opacity-60">
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                                Accesso in corso…
                            </>
                        ) : (
                            'Accedi'
                        )}
                    </button>

                    <p className="text-center text-sm text-ink-500">
                        Non hai un account?{' '}
                        <Link to={`/register?redirect=${encodeURIComponent(from)}`} className="text-wine-700 font-medium underline underline-offset-2 hover:no-underline">
                            Registrati
                        </Link>
                    </p>
                    <button type="button" className="text-sm text-wine-700 underline" disabled={isLoading} onClick={resetPassword}>Password dimenticata?</button>
                    <p role="status" className="text-sm">{resetMessage}</p>
                </motion.form>
            </div>
        </div>
    )
}