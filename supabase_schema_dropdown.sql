-- ─────────────────────────────────────────────────────────────────────────────
-- PIANO B: tabelle Dropdown Academy in public con prefisso dropdown_
-- Lo schema "dropdown" separato non è esponibile via Data API su questo
-- progetto condiviso; le tabelle restano isolate per NOME (dropdown_*)
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.dropdown_profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

create table if not exists public.dropdown_courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL,
    thumbnail_url TEXT,
    promo_video_url TEXT,
    category TEXT NOT NULL CHECK (category IN ('modulare', 'ableton', 'serum', 'max-msp', 'pigments', 'altro')),
    level TEXT DEFAULT 'beginner' NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    is_published BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

create table if not exists public.dropdown_course_modules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.dropdown_courses ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

create table if not exists public.dropdown_lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    module_id UUID REFERENCES public.dropdown_course_modules ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    video_id TEXT,
    video_duration NUMERIC,
    order_index INTEGER NOT NULL,
    is_free BOOLEAN DEFAULT FALSE NOT NULL,
    resources JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

create table if not exists public.dropdown_purchases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.dropdown_profiles ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.dropdown_courses ON DELETE CASCADE NOT NULL,
    paypal_order_id TEXT,
    amount_paid NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'completed', 'refunded', 'failed')),
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

create table if not exists public.dropdown_user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.dropdown_profiles ON DELETE CASCADE NOT NULL,
    lesson_id UUID REFERENCES public.dropdown_lessons ON DELETE CASCADE NOT NULL,
    completed BOOLEAN DEFAULT FALSE NOT NULL,
    last_position NUMERIC DEFAULT 0 NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT dropdown_user_progress_user_lesson_key UNIQUE (user_id, lesson_id)
);

create table if not exists public.dropdown_free_downloads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN ('preset', 'sample-pack', 'template')),
    thumbnail_url TEXT,
    download_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

create table if not exists public.dropdown_contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' NOT NULL CHECK (status IN ('unread', 'read', 'replied')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Trigger profilo alla registrazione
create or replace function public.dropdown_handle_new_user()
returns trigger as $$
begin
  insert into public.dropdown_profiles (id, email, full_name, avatar_url, is_admin)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'avatar_url',
    false
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists dropdown_on_auth_user_created on auth.users;
create trigger dropdown_on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.dropdown_handle_new_user();

-- RLS
alter table public.dropdown_profiles enable row level security;
alter table public.dropdown_courses enable row level security;
alter table public.dropdown_course_modules enable row level security;
alter table public.dropdown_lessons enable row level security;
alter table public.dropdown_purchases enable row level security;
alter table public.dropdown_user_progress enable row level security;
alter table public.dropdown_free_downloads enable row level security;
alter table public.dropdown_contact_messages enable row level security;

create policy "dropdown: public read profiles" on public.dropdown_profiles for select using (true);
create policy "dropdown: update own profile" on public.dropdown_profiles for update using (auth.uid() = id);

create policy "dropdown: read published courses" on public.dropdown_courses for select
  using (is_published = true or exists (select 1 from public.dropdown_profiles where id = auth.uid() and is_admin));
create policy "dropdown: admin full courses" on public.dropdown_courses for all
  using (exists (select 1 from public.dropdown_profiles where id = auth.uid() and is_admin));

create policy "dropdown: read modules" on public.dropdown_course_modules for select using (true);
create policy "dropdown: admin full modules" on public.dropdown_course_modules for all
  using (exists (select 1 from public.dropdown_profiles where id = auth.uid() and is_admin));

create policy "dropdown: read lessons" on public.dropdown_lessons for select using (true);
create policy "dropdown: admin full lessons" on public.dropdown_lessons for all
  using (exists (select 1 from public.dropdown_profiles where id = auth.uid() and is_admin));

create policy "dropdown: read own purchases" on public.dropdown_purchases for select using (auth.uid() = user_id);
create policy "dropdown: insert own purchase" on public.dropdown_purchases for insert with check (auth.uid() = user_id);
create policy "dropdown: admin full purchases" on public.dropdown_purchases for all
  using (exists (select 1 from public.dropdown_profiles where id = auth.uid() and is_admin));

create policy "dropdown: manage own progress" on public.dropdown_user_progress for all using (auth.uid() = user_id);

create policy "dropdown: read downloads" on public.dropdown_free_downloads for select using (true);
create policy "dropdown: admin full downloads" on public.dropdown_free_downloads for all
  using (exists (select 1 from public.dropdown_profiles where id = auth.uid() and is_admin));

create policy "dropdown: insert contact message" on public.dropdown_contact_messages for insert with check (true);
create policy "dropdown: admin full messages" on public.dropdown_contact_messages for all
  using (exists (select 1 from public.dropdown_profiles where id = auth.uid() and is_admin));

-- Permessi espliciti (non si sa mai quale default abbia questo progetto)
grant select on table public.dropdown_profiles to anon, authenticated;
grant update on table public.dropdown_profiles to authenticated;

grant select on table public.dropdown_courses to anon, authenticated;
grant select on table public.dropdown_course_modules to anon, authenticated;
grant select on table public.dropdown_lessons to anon, authenticated;

grant select, insert on table public.dropdown_purchases to authenticated;
grant select on table public.dropdown_purchases to anon;

grant all on table public.dropdown_user_progress to authenticated;

grant select on table public.dropdown_free_downloads to anon, authenticated;
grant insert on table public.dropdown_contact_messages to anon, authenticated;

-- Nota: i grant admin completi (update/delete su corsi ecc.) passano da service_role
-- lato server; le policy "admin" sopra consentono operazioni da client autenticato admin.