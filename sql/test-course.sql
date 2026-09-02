-- Corso TEMPORANEO di test acquisto (€0.10) — ELIMINARE dopo il test
INSERT INTO public.dropdown_courses (slug, title, description, price, thumbnail_url, category, level, is_published)
VALUES (
  'test-acquisto-010',
  '[TEST] Corso da 10 centesimi',
  'Corso temporaneo per testare il checkout PayPal. Da eliminare dopo il test.',
  0.10,
  '/images/courses/pigments_masterclass.jpg',
  'altro',
  'beginner',
  true
);

-- Aggiunge un prezzo coerente anche al fallback server-side? No: l'API legge da Supabase prima.
-- Il fallback COURSE_PRICES non contiene questo slug, ma la query Supabase avrà priorità.