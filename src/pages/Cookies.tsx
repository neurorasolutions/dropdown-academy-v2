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
                    heading: '2. Cookie necessari',
                    body: [
                        'Utilizziamo cookie necessari al funzionamento del sito: sessione di autenticazione (per mantenerti connesso) e preferenze di navigazione, incluso il record delle tue scelte sul consenso. Questi cookie non richiedono il tuo consenso e non sono utilizzati per profilazione.',
                    ],
                },
                {
                    heading: '3. Cookie di pagamento (PayPal)',
                    body: [
                        'Il gateway di pagamento PayPal può impostare cookie propri durante il checkout, necessari per elaborare i pagamenti in sicurezza. Questi cookie sono caricati solo con il tuo consenso esperto, che puoi dare dal banner cookie o dalle preferenze: puoi cambiarlo in ogni momento.',
                    ],
                },
                {
                    heading: '4. Cookie di terze parti',
                    body: [
                        'I video di YouTube incorporati e il pulsante PayPal possono impostare cookie propri secondo le rispettive policy. Ti consigliamo di consultare le informative di YouTube e PayPal per i dettagli.',
                    ],
                },
                {
                    heading: '5. Gestione dei cookie',
                    body: [
                        'Puoi cancellare o bloccare i cookie dalle impostazioni del tuo browser. Nota che la disabilitazione dei cookie tecnici può impedire l\'accesso all\'area personale e la fruizione dei corsi acquistati.',
                    ],
                },
            ]}
        />
    )
}