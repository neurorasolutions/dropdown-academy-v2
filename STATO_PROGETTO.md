# Dropdown Academy v2 — Stato Progetto

Ultimo aggiornamento: 2 settembre 2026, fine sessione.

## Cosa è stato fatto

### Progetto
- **Nuovo sito** in `~/Documents/Neurora/CLIENTI/DROPDOWNACADEMY/DROPDOWN_Website_v2/` (refactor totale del vecchio `DROPDOWN_Website` che resta intatto come riferimento)
- **GitHub**: https://github.com/neurorasolutions/dropdown-academy-v2 (branch main)
- **Vercel**: deploy automatico da GitHub → https://dropdown-academy-v2.vercel.app — ONLINE e funzionante
- **Design**: palette avorio/bordeaux/ottone, Playfair Display + Inter (niente più neon cyberpunk)
- **Stack**: React 18 + TS + Vite + Tailwind + Supabase + PayPal + Vercel serverless

### Database (Supabase condiviso Neurora: acquvpgmitvkykdppbkv)
- DB **condiviso tra progetti Neurora**: scelto PIANO B = tabelle in `public` con prefisso `dropdown_*`
  (lo schema separato `dropdown` NON era esponibile via Data API — setting "Exposed schemas" del dashboard non applicava il salvataggio; lo schema `dropdown` esiste ma è INUTILIZZATO, si può cancellare)
- 8 tabelle: dropdown_profiles, dropdown_courses, dropdown_course_modules, dropdown_lessons, dropdown_purchases, dropdown_user_progress, dropdown_free_downloads, dropdown_contact_messages
- Trigger `dropdown_handle_new_user` su auth.users → crea profilo automaticamente (VERIFICATO funzionante)
- RLS completa con policy per ruolo utente/admin
- Seed caricato: **6 corsi, 14 moduli, 43 lezioni** (tutti pubblicati)
- File SQL: `supabase_schema_dropdown.sql` + `supabase_seed_dropdown.sql` (in root progetto)

### Credenziali
- **Supabase** (utente account Neurora): URL https://acquvpgmitvkykdppbkv.supabase.co + anon key nel .env locale (NON nel repo)
- **PayPal**: in Sandbox su Vercel. Client ID live + secret recuperati ma NON ancora impostati (quando si passa a live: sostituire VITE_PAYPAL_CLIENT_ID e PAYPAL_CLIENT_SECRET, PAYPAL_MODE=live su Vercel)
- Account di test sandbox PayPal: usarne uno `@personal.example.com` dal developer dashboard (l'utente ha completato UN pagamento sandbox che però non è stato registrato — vedi issue sotto)

## ISSUE APERTA — Test acquisto non registra l'acquisto

Sintomo: pagamento PayPal sandbox completato → messaggio verde "Pagamento completato" → ma `dropdown_purchases` resta VUOTA. Inoltre /player mostra "corso non acquistato".

### Diagnosi già fatta
- DB verificato OK: INSERT autenticato manuale funziona (testato con token reale, 201)
- Le query embed PostgREST ora sono corrette (dropdown_course_modules, dropdown_courses...)
- Errore console visto dall'utente: GET `dropdown_purchases?select=course_id,courses(slug)` → 400: ERA la vecchia relazione `courses(slug)` — FIXATO nel commit b878d9e
- Soluzione implementata (commit b02adfd): registrazione acquisto SPOSTATA SERVER-SIDE in `api/capture-order.ts`:
  - riceve orderID + courseSlug + userToken
  - valida JWT utente, rilegge prezzo dal DB, verifica importo pagato = prezzo corso (anti-tampering)
  - cattura pagamento PayPal e inserisce acquisto nella stessa chiamata
  - se insert fallisce dopo capture OK: risponde comunque 200 con warning (transazione PayPal recuperabile)
- API verificata funzionante: create-order → 200 con orderID; capture con ordine non pagato → errore atteso

### PROSSIMI PASSI (riprendere da qui)
1. Fare un test acquisto COMPLETO dal sito con hard refresh (Cmd+Shift+R) PRIMA di pagare:
   l'ultimo tentativo dell'utente risulta senza acquisti nel DB — capire se aveva il JS vecchio
   in cache o se il pagamento non è arrivato a COMPLETED
2. Se l'acquisto viene registrato: pulizia → rimborso (sandbox non serve), cancellare corso di test
   `test-acquisto-010` e l'utente diagnostico `test-diag2@dropdownacademy.com` (password Test1234!)
3. Passare a PayPal LIVE (sostituire le due variabili su Vercel + PAYPAL_MODE=live)
4. Da fare ancora:
   - Dominio custom su Vercel + aggiornare VITE_APP_URL + Supabase Auth URL Configuration (Site URL + Redirect URLs)
   - Area admin: pagine Vendite/Messaggi/Download sono placeholder → collegare a Supabase
   - Attestato di completamento (promesso nella FAQ ma non implementato)
   - Sitemap + robots.txt
   - Migrare i video lezioni (column video_id vuota nel seed; vecchio player non li aveva)

### Note tecniche
- Il frontend usa l'utente `dv.pantaleo@gmail.com` come admin (is_admin=true, promosso via SQL)
- Le query embed PostgREST usano i nomi di RELAZIONE: con le tabelle rinominate, gli embed sono
  `dropdown_course_modules(*, dropdown_lessons(*))` e `dropdown_courses(slug)` — i nomi dentro select() devono coincidere col nome tabella
- lib/purchases.ts ha fallback demo con localStorage se isDemoMode
- Il vecchio `.env` del progetto v1 punta a demo.supabase.co (mai collegato davvero)

## Comandi utili
```bash
cd ~/Documents/Neurora/CLIENTI/DROPDOWNACADEMY/DROPDOWN_Website_v2
npm run dev        # sviluppo locale (http://localhost:5173)
npm run build      # build produzione (verificata OK)
git push           # → deploy automatico Vercel
```