import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
export default function ResetPassword() {
    const [busy, setBusy] = useState(false)
    const [message, setMessage] = useState('')
    const [done, setDone] = useState(false)
    async function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const f = new FormData(e.currentTarget)
        const password = String(f.get('password'))
        if (password !== f.get('confirm')) {
            setMessage('Le password non coincidono.')
            return
        }
        setBusy(true)
        setMessage('')
        try {
            const { error } = await supabase.auth.updateUser({ password })
            if (error) throw error
            setDone(true)
        } catch {
            setMessage('Impossibile aggiornare la password. Richiedi un nuovo link dalla pagina di accesso.')
        } finally {
            setBusy(false)
        }
    }
    return (
        <div className="container-site py-16">
            <form onSubmit={submit} className="card p-8 max-w-md mx-auto space-y-5">
                <h1 className="font-serif text-3xl">Nuova password</h1>
                {done ? (
                    <>
                        <p>Password aggiornata.</p>
                        <Link className="btn-primary" to="/login">
                            Accedi
                        </Link>
                    </>
                ) : (
                    <>
                        <label className="block">
                            Password
                            <input
                                name="password"
                                className="input-field mt-2"
                                type="password"
                                minLength={8}
                                required
                                autoComplete="new-password"
                            />
                        </label>
                        <label className="block">
                            Ripeti password
                            <input
                                name="confirm"
                                className="input-field mt-2"
                                type="password"
                                minLength={8}
                                required
                                autoComplete="new-password"
                            />
                        </label>
                        <button className="btn-primary" disabled={busy}>
                            {busy ? 'Salvataggio…' : 'Aggiorna password'}
                        </button>
                        <p role="status">{message}</p>
                    </>
                )}
            </form>
        </div>
    )
}
