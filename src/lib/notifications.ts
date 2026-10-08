export async function requestPasswordReset(email: string): Promise<{ error: Error | null }> {
    const res = await fetch('/api/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    })
    if (!res.ok) return { error: new Error('Invio non riuscito.') }
    return { error: null }
}

export async function sendWelcomeEmail(email: string): Promise<void> {
    await fetch('/api/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    }).catch(() => undefined)
}
