import { supabase } from '@/lib/supabase'

export async function requestPasswordReset(email: string): Promise<{ error: Error | null }> {
    const res = await fetch('/api/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    })
    if (!res.ok) return { error: new Error('Invio non riuscito.') }
    return { error: null }
}

export async function sendWelcomeIfNeeded(): Promise<void> {
    const { data } = await supabase.auth.getSession()
    if (!data.session) return
    await fetch('/api/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.session.access_token}` },
    }).catch(() => undefined)
}
