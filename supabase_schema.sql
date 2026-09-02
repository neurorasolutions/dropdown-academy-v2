-- DROP TABLES IF EXISTS (For clean slate if needed, comment out in production)
-- DROP TABLE IF EXISTS public.contact_messages CASCADE;
-- DROP TABLE IF EXISTS public.free_downloads CASCADE;
-- DROP TABLE IF EXISTS public.user_progress CASCADE;
-- DROP TABLE IF EXISTS public.purchases CASCADE;
-- DROP TABLE IF EXISTS public.lessons CASCADE;
-- DROP TABLE IF EXISTS public.course_modules CASCADE;
-- DROP TABLE IF EXISTS public.courses CASCADE;
-- DROP TABLE IF EXISTS public.profiles CASCADE;

-- 1. Profiles Table (Linked to Supabase Auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Courses Table
CREATE TABLE public.courses (
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

-- 3. Course Modules Table
CREATE TABLE public.course_modules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Lessons Table
CREATE TABLE public.lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    module_id UUID REFERENCES public.course_modules ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    video_id TEXT,
    video_duration NUMERIC,
    order_index INTEGER NOT NULL,
    is_free BOOLEAN DEFAULT FALSE NOT NULL,
    resources JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Purchases Table
CREATE TABLE public.purchases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses ON DELETE CASCADE NOT NULL,
    paypal_order_id TEXT,
    amount_paid NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'completed', 'refunded', 'failed')),
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. User Progress Table
CREATE TABLE public.user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
    lesson_id UUID REFERENCES public.lessons ON DELETE CASCADE NOT NULL,
    completed BOOLEAN DEFAULT FALSE NOT NULL,
    last_position NUMERIC DEFAULT 0 NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT user_progress_user_id_lesson_id_key UNIQUE (user_id, lesson_id)
);

-- 7. Free Downloads Table
CREATE TABLE public.free_downloads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN ('preset', 'sample-pack', 'template')),
    thumbnail_url TEXT,
    download_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. Contact Messages Table
CREATE TABLE public.contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' NOT NULL CHECK (status IN ('unread', 'read', 'replied')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Trigger function to automatically create profile on sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, is_admin)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'avatar_url',
    FALSE
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution link
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.free_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies:

-- Profiles Policies
CREATE POLICY "Allow public read access to profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow users to update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Courses Policies
CREATE POLICY "Allow public read to published courses" ON public.courses FOR SELECT USING (is_published = true OR (SELECT is_admin FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Allow admin full access to courses" ON public.courses ALL USING ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()));

-- Course Modules Policies
CREATE POLICY "Allow public read to modules" ON public.course_modules FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to modules" ON public.course_modules ALL USING ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()));

-- Lessons Policies
CREATE POLICY "Allow public read to lessons" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to lessons" ON public.lessons ALL USING ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()));

-- Purchases Policies
CREATE POLICY "Allow users to read their own purchases" ON public.purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow authenticated users to insert purchases" ON public.purchases FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow admin full access to purchases" ON public.purchases ALL USING ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()));

-- User Progress Policies
CREATE POLICY "Allow users to manage their own progress" ON public.user_progress ALL USING (auth.uid() = user_id);

-- Free Downloads Policies
CREATE POLICY "Allow public read to downloads" ON public.free_downloads FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to downloads" ON public.free_downloads ALL USING ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()));

-- Contact Messages Policies
CREATE POLICY "Allow anyone to insert contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin full access to contact messages" ON public.contact_messages ALL USING ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()));
