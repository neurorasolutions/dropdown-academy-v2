# Dropdown Academy — Stato aggiornato al 10 settembre 2026

## Codice completato e verificato

- Pannello amministrativo collegato a Supabase: panoramica, corsi, lezioni/video/materiali, vendite, download e messaggi.
- Catalogo, home, progressi studenti e player collegati ai dati reali.
- Recupero password e conservazione della destinazione del corso durante login/registrazione.
- Attestato di completamento verificato dal database, stampabile e salvabile in PDF.
- Sitemap dinamica, robots e metadati.
- Pagamenti registrati soltanto dal server, con verifica di utente/corso/importo/valuta, prevenzione dei duplicati sullo stesso ordine e recupero dopo errore di salvataggio.
- Migrazione SQL pronta per proteggere profili, acquisti, video e progressi; importazione pronta dei sette download esistenti.

## Verifiche eseguite

- Build di produzione riuscita, inclusa la verifica TypeScript delle API.
- Lint senza errori né avvisi.
- 24 test automatici superati: PostgreSQL/RLS in ambiente isolato, PayPal simulato, normalizzazione video, catalogo e sitemap.
- Browser sul catalogo Supabase reale: ricerca, layout telefono a 375px, dettaglio corso, menu mobile, modulo login e protezione dell'area admin.
- Database online letto senza modifiche: sei corsi pubblicati, tabella download vuota.

## Da completare online

Questa sessione ha aggiornato il codice locale; non ha pubblicato il sito né modificato il database di produzione.

- Configurare la chiave server Supabase, assente nel `.env` locale.
- Coordinare migrazione SQL e release su Vercel: la precedente registrazione acquisti dal browser non è compatibile con le nuove regole.
- Importare i sette download con lo script fornito.
- Applicare `sql/20260913_course_videos.sql`: collega i 12 video e le dispense PDF del corso Max/MSP e sostituisce i programmi dimostrativi di VCV Rack e Ableton con le 9 e 12 lezioni reali fornite. Le durate non esposte da Drive sono impostate a 60 minuti come valore da rivedere dopo l'anteprima dei video.
- Test completo nell'ambiente sandbox configurato; eventuale acquisto reale e rimborso con il titolare dell'account.

Procedura, configurazione e limiti documentati in `README.md`. Nessuna password o chiave deve essere aggiunta a questo documento.
