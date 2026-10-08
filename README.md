# Dropdown Academy

Sito React, TypeScript e Vite per catalogo corsi, formazione, risorse gratuite, acquisti PayPal e area studenti. Il database Supabase condiviso usa esclusivamente tabelle `dropdown_*`.

## Avvio e verifiche

Richiede Node.js 20 o successivo.

```sh
npm ci
npm run dev
npm run build
npm run lint
npm test
```

`npm run dev` avvia il frontend. Le API di pagamento e la sitemap richiedono l'ambiente Vercel; per provarle localmente usa `npm run dev:backend` con Vercel CLI configurata. I test automatici simulano PayPal senza pagamenti e verificano le regole SQL su un database PostgreSQL locale isolato.

Copia `.env.example` in `.env` per un nuovo ambiente. Le credenziali esistenti non vanno sovrascritte. `SUPABASE_SERVICE_ROLE_KEY` e `PAYPAL_CLIENT_SECRET` sono esclusivamente server: non devono avere prefisso `VITE_`, essere salvate nel repository o inviate al browser.

## Funzioni completate

- Catalogo, home e area personale usano i dati reali; un catalogo vuoto non riattiva corsi dimostrativi.
- Pannello amministrativo: statistiche, vendite e ricerca, lettura/stato dei messaggi, creazione e modifica corsi, pubblicazione, aggiunta moduli, gestione lezioni e materiali, creazione/modifica/eliminazione risorse.
- Player con anteprime gratuite per utenti registrati, progressi salvati, navigazione fra lezioni e materiali. Video supportati: YouTube, Vimeo, Google Drive e MP4/WebM/OGG HTTPS. La durata nel database è in **minuti**, coerentemente con il seed esistente.
- Attestato stampabile o salvabile in PDF, con nome, corso, data e codice stabile. Il database verifica acquisto e completamento di tutte le lezioni con video collegato.
- Recupero password e ritorno al corso dopo login/registrazione.
- Sitemap dinamica dei corsi pubblicati, robots e metadati di navigazione.
- Pagamenti con autenticazione, prezzo letto dal database, ordine collegato a utente/corso, verifica valuta/importo, registrazione server, recupero dopo un errore e protezione dai callback duplicati.

## Attivazione online: operazioni ancora da eseguire

La versione aggiornata **non è stata pubblicata** e le migrazioni **non sono state applicate al database online**. Il catalogo pubblico è stato verificato in sola lettura. La configurazione locale esistente non contiene `SUPABASE_SERVICE_ROLE_KEY`.

1. Eseguire `sql/preflight.sql` nel progetto Supabase corretto. Eventuali ordini PayPal duplicati richiedono verifica: nessun dato di pagamento viene cancellato automaticamente.
2. Configurare `SUPABASE_SERVICE_ROLE_KEY` nell'ambiente server Vercel insieme alle variabili già esistenti. Per le prove usare credenziali PayPal sandbox e `PAYPAL_MODE=sandbox`. Non mescolare le credenziali sandbox/live.
3. Preparare la release e applicare `sql/20260910_complete_academy.sql`. La migrazione è transazionale e ripetibile; protegge profili, acquisti, video e attestati. Cambia i permessi degli acquisti: vecchio checkout e nuove regole non sono compatibili. Coordinare migrazione e pubblicazione, evitando acquisti durante il passaggio.
4. Eseguire `sql/20260910_downloads.sql`: importa i sette link già presenti nella vecchia pagina, senza contatori inventati e senza duplicarli alle esecuzioni successive.
5. Eseguire `sql/20260913_course_videos.sql`: collega i 12 video e le dispense PDF del corso Max/MSP e sostituisce i programmi dimostrativi di VCV Rack e Ableton con le 9 e 12 lezioni reali fornite. Le durate non esposte da Drive sono impostate a 60 minuti come valore da rivedere dopo l'anteprima dei video.
6. Verificare nelle impostazioni Supabase Auth che dominio di produzione e percorso `/reset-password` siano ammessi nei redirect; i template email sono condivisi con altri progetti e non sono stati modificati.
7. Verificare in sandbox registrazione, conferma email, login, acquisto, apertura video, avanzamento e attestato; quindi effettuare una release coordinata. Un pagamento reale e l'eventuale rimborso richiedono un test dedicato con il titolare dell'account.

La sola copia del codice su Vercel non sostituisce questi passaggi. Le pagine amministrative segnalano gli errori se le funzioni SQL non sono ancora installate.

## Limiti da conoscere

- Nessun pagamento o rimborso reale è stato eseguito. Le verifiche PayPal automatiche usano risposte simulate.
- I rimborsi effettuati esternamente in PayPal devono essere riconciliati nel database da un operatore autorizzato: non è presente un webhook rimborsi.
- I link video vengono rilasciati solo agli utenti autorizzati, ma la protezione contro la condivisione dei link dipende anche dall'hosting video. Non è implementato un servizio di streaming con URL firmati.
- L'attestato descrive il completamento del percorso; non è una qualifica accreditata né una verifica automatica del tempo effettivo di visione.
- L'audit delle dipendenze segnala avvisi nella toolchain `@vercel/node` e in React Router 6. La navigazione di ritorno è limitata a percorsi interni e questo progetto non usa hydration SSR. Gli aggiornamenti maggiori delle dipendenze restano da valutare separatamente.

Riferimenti tecnici: [PayPal Orders API](https://developer.paypal.com/api/rest/integration/orders-api/), [permessi sulle colonne Supabase](https://supabase.com/docs/guides/database/postgres/column-level-security), [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security).
