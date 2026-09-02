import { LegalPage } from './LegalPage'

export default function Privacy() {
    return (
        <LegalPage
            title="Privacy Policy"
            subtitle="Informazioni legali"
            sections={[
                {
                    heading: '1. Titolare del trattamento',
                    body: [
                        'Il Titolare del trattamento dei dati personali è Dropdown Academy. Per qualsiasi richiesta relativa ai tuoi dati puoi scrivere a info@dropdownacademy.com.',
                    ],
                },
                {
                    heading: '2. Dati raccolti',
                    body: [
                        'Al momento della registrazione raccogliamo: indirizzo email, nome completo e, facoltativamente, una foto profilo. In caso di acquisto, conserviamo i dati della transazione (importo, identificativo ordine PayPal e stato del pagamento).',
                        'Se utilizzi il modulo di contatto, trattiamo nome, email e contenuto del messaggio esclusivamente per rispondere alla tua richiesta.',
                    ],
                },
                {
                    heading: '3. Finalità del trattamento',
                    body: [
                        'I dati sono trattati per: gestire il tuo account e gli acquisti, fornire l\'accesso ai corsi acquistati, rispondere alle richieste di assistenza e adempiere agli obblighi di legge. I dati di pagamento sono processati da PayPal secondo la loro privacy policy: non abbiamo mai accesso ai dettagli completi della tua carta.',
                    ],
                },
                {
                    heading: '4. Conservazione',
                    body: [
                        'I dati dell\'account sono conservati fino alla richiesta di cancellazione. I dati relativi agli acquisti sono conservati per il periodo richiesto dalla normativa fiscale vigente.',
                    ],
                },
                {
                    heading: '5. I tuoi diritti',
                    body: [
                        'Puoi esercitare in ogni momento i diritti di accesso, rettifica, cancellazione, limitazione e portabilità dei dati scrivendo a info@dropdownacademy.com. Hai inoltre il diritto di proporre reclamo al Garante per la protezione dei dati personali.',
                    ],
                },
            ]}
        />
    )
}