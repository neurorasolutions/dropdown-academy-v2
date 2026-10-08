import { ApiError } from './payment.js'

const FROM = process.env.RESEND_FROM || 'Dropdown Academy <info@neurora.it>'

export function emailConfigured() {
    return Boolean(process.env.RESEND_API_KEY)
}

export async function sendEmail(to: string, subject: string, html: string) {
    const key = process.env.RESEND_API_KEY
    if (!key) throw new ApiError(503, 'Invio email temporaneamente non disponibile.')
    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: FROM, to: [to], subject, html }),
        signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) throw new ApiError(502, 'Invio email non riuscito.')
}

function layout(title: string, body: string) {
    return `<!doctype html><html lang="it"><body style="margin:0;padding:24px;background:#F3EEE4;">
  <div style="max-width:480px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#2C1018;border-radius:16px;padding:40px 32px;text-align:center;">
    <img src="https://www.dropdownacademy.com/logo-dark.png" alt="Dropdown Academy" width="56" height="56" style="display:block;margin:0 auto 16px;border-radius:12px;" />
    <h1 style="color:#ffffff;font-size:24px;margin:0 0 8px;">Dropdown Academy</h1>
    <p style="color:#D4AF6A;font-size:14px;margin:0 0 32px;">Sound Design &amp; Produzione Musicale</p>
    <h2 style="color:#ffffff;font-size:20px;margin:0 0 16px;">${title}</h2>
    ${body}
    <hr style="border:none;border-top:1px solid #571F2E;margin:24px 0;" />
    <p style="color:#7A5C66;font-size:11px;">Dropdown Academy</p>
  </div>
</body></html>`
}

export function welcomeTemplate(name: string) {
    const who = name.trim() ? `Ciao ${name.trim()},` : 'Ciao,'
    return {
        subject: 'Benvenuto in Dropdown Academy',
        html: layout(
            'Benvenuto!',
            `<p style="color:#E9E1D0;font-size:14px;line-height:1.6;margin:0 0 24px;text-align:left;">
              ${who} il tuo account è attivo. Da ora puoi acquistare i corsi, seguire le tue lezioni
              e scaricare le risorse dalla tua area personale.
            </p>
            <a href="https://www.dropdownacademy.com/courses" style="display:inline-block;padding:14px 32px;background-color:#D4AF6A;color:#2C1018;font-weight:700;font-size:15px;text-decoration:none;border-radius:12px;">
              Esplora i corsi →
            </a>`,
        ),
    }
}

export function resetTemplate(link: string) {
    return {
        subject: 'Reimposta la tua password',
        html: layout(
            'Reimposta la password',
            `<p style="color:#E9E1D0;font-size:14px;line-height:1.6;margin:0 0 24px;text-align:left;">
              Hai richiesto di reimpostare la password del tuo account. Clicca il pulsante qui sotto
              per scegliere una nuova password.
            </p>
            <a href="${link}" style="display:inline-block;padding:14px 32px;background-color:#D4AF6A;color:#2C1018;font-weight:700;font-size:15px;text-decoration:none;border-radius:12px;">
              Reimposta password →
            </a>
            <p style="color:#B8A89A;font-size:12px;margin:24px 0 0;line-height:1.5;">
              Se non hai richiesto il reset, puoi ignorare questa email.
            </p>`,
        ),
    }
}
