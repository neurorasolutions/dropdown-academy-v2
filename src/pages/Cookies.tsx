import { LegalPage } from './LegalPage'

export default function Cookies() {
    return (
        <LegalPage
            title="Cookie Policy"
            subtitle="Informazioni legali"
            sections={[
                {
                    heading: '1. Cosa sono i cookie',
                    body: [
                        'I cookie sono piccoli file di testo che il sito memorizza sul tuo dispositivo per garantirne il funzionamento e ricordare le tue preferenze.',
                    ],
                },
                {
                    heading: '2. Cookie tecnici',
                    body: [
                        'Utilizziamo esclusivamente cookie tecnici necessari al funzionamento del sito: sessione di autenticazione (per mantenerti connesso) e preferenze di navigazione. Questi cookie non richiedono il tuo consenso e non sono utilizzati per profilazione.',
                    ],
                },
                {
                    heading: '3. Cookie di terze parti',
                    body: [
                        'I video di YouTube incorporati e il pulsante PayPal possono impostare cookie propri secondo le rispettive policy. Ti consigliamo di consultare le informative di YouTube e PayPal per i dettagli.',
                    ],
                },
                {
                    heading: '4. Gestione dei cookie',
                    body: [
                        'Puoi cancellare o bloccare i cookie dalle impostazioni del tuo browser. Nota che la disabilitazione dei cookie tecnici può impedire l\'accesso all\'area personale e la fruizione dei corsi acquistati.',
                    ],
                },
            ]}
        />
    )
}