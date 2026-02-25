-- Uzantılar
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabloları Oluştur (IF NOT EXISTS ile güvenli)
CREATE TABLE IF NOT EXISTS public.users_profile (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS public.user_baseline (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    identity TEXT,
    presentation_goal TEXT,
    hair_coverage TEXT,
    lifestyle_contexts TEXT[],
    beauty_comfort TEXT,
    wardrobe_preference TEXT,
    core_priority TEXT,
    face_shape TEXT,
    skin_tone TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS public.moments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    moment_type TEXT NOT NULL,
    context_modifiers JSONB DEFAULT '{}'::jsonb,
    glow_score INTEGER,
    plan_json JSONB,
    is_favorite BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.barbers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT,
    rating DECIMAL(3,1) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    specialties TEXT[],
    price_range TEXT,
    phone TEXT,
    instagram_url TEXT,
    image_url TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    barber_id UUID REFERENCES public.barbers(id) ON DELETE CASCADE NOT NULL,
    moment_id UUID REFERENCES public.moments(id),
    appointment_date TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.favorite_styles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    style_name TEXT,
    image_url TEXT,
    prompt TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. RLS Etkinleştir
ALTER TABLE public.users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_baseline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorite_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 3. Politikaları Temizle ve Yeniden Oluştur (Hata almamak için DROP IF EXISTS kullanıyoruz)
DO $$ 
BEGIN
    -- Users Profile
    DROP POLICY IF EXISTS "Users can manage own profile" ON public.users_profile;
    CREATE POLICY "Users can manage own profile" ON public.users_profile FOR ALL USING (auth.uid() = user_id);

    -- User Baseline
    DROP POLICY IF EXISTS "Users can manage own baseline" ON public.user_baseline;
    CREATE POLICY "Users can manage own baseline" ON public.user_baseline FOR ALL USING (auth.uid() = user_id);

    -- Moments
    DROP POLICY IF EXISTS "Users can manage own moments" ON public.moments;
    CREATE POLICY "Users can manage own moments" ON public.moments FOR ALL USING (auth.uid() = user_id);

    -- Barbers
    DROP POLICY IF EXISTS "Anyone can view barbers" ON public.barbers;
    CREATE POLICY "Anyone can view barbers" ON public.barbers FOR SELECT USING (true);

    -- Appointments
    DROP POLICY IF EXISTS "Users can manage own appointments" ON public.appointments;
    CREATE POLICY "Users can manage own appointments" ON public.appointments FOR ALL USING (auth.uid() = user_id);

    -- Favorite Styles
    DROP POLICY IF EXISTS "Users can manage own favorites" ON public.favorite_styles;
    CREATE POLICY "Users can manage own favorites" ON public.favorite_styles FOR ALL USING (auth.uid() = user_id);

    -- Notifications
    DROP POLICY IF EXISTS "Users can manage own notifications" ON public.notifications;
    CREATE POLICY "Users can manage own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);
END $$;