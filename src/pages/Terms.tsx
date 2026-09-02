import { LegalPage } from './LegalPage'

export default function Terms() {
    return (
        <LegalPage
            title="Termini di Servizio"
            subtitle="Informazioni legali"
            sections={[
                {
                    heading: '1. Oggetto',
                    body: [
                        'I presenti termini regolano l\'accesso e l\'uso della piattaforma Dropdown Academy, inclusi i corsi online, i materiali scaricabili e l\'iscrizione ai corsi in presenza.',
                    ],
                },
                {
                    heading: '2. Account',
                    body: [
                        'Per acquistare un corso è necessario creare un account con un indirizzo email valido. Sei responsabile della riservatezza delle tue credenziali e di ogni attività svolta tramite il tuo account.',
                    ],
                },
                {
                    heading: '3. Acquisti e pagamenti',
                    body: [
                        'I prezzi sono indicati in euro, IVA inclusa. I pagamenti sono elaborati tramite PayPal: al completamento, l\'accesso al corso è attivato immediatamente nella tua area personale.',
                    ],
                },
                {
                    heading: '4. Diritto di recesso',
                    body: [
                        'In conformità alla normativa sui servizi digitali, il diritto di recesso di 14 giorni si applica solo se il contenuto digitale non è stato già iniziato a fruire con il tuo consenso esplicito. In caso di dubbi contatta info@dropdownacademy.com.',
                    ],
                },
                {
                    heading: '5. Uso dei contenuti',
                    body: [
                        'I corsi, i video e i materiali sono protetti da copyright e sono destinati esclusivamente all\'uso personale dello studente. È vietata la condivisione, la riproduzione o la distribuzione dei contenuti a terzi, anche parziale.',
                    ],
                },
                {
                    heading: '6. Accesso lifetime',
                    body: [
                        'L\'accesso ai corsi acquistati non ha scadenza. In caso di cessazione dell\'attività, garantiremo un preavviso di almeno 90 giorni e, ove possibile, modalità alternative di fruizione dei contenuti acquistati.',
                    ],
                },
            ]}
        />
    )
}