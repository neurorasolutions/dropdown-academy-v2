-- Traccia l'invio dell'email di benvenuto (idempotente).
begin;
set local statement_timeout = '30s';
set local lock_timeout = '5s';

alter table public.dropdown_profiles
  add column if not exists welcome_sent boolean not null default false;

commit;
