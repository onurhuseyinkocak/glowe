-- 1. Users Profile Tablosu
CREATE TABLE IF NOT EXISTS public.users_profile (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id)
);

-- 2. User Baseline (Onboarding Verileri)
CREATE TABLE IF NOT EXISTS public.user_baseline (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    identity TEXT,
    presentation_goal TEXT,
    hair_coverage TEXT,
    lifestyle_contexts TEXT[],
    beauty_comfort TEXT,
    wardrobe_preference TEXT,
    core_priority TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id)
);

-- 3. Moments (Analizler ve Planlar)
CREATE TABLE IF NOT EXISTS public.moments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    moment_type TEXT NOT NULL,
    context_modifiers JSONB DEFAULT '{}'::jsonb,
    glow_score INTEGER,
    plan_json JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Favorite Styles (Sanal Deneme Favorileri)
CREATE TABLE IF NOT EXISTS public.favorite_styles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    style_name TEXT,
    image_url TEXT,
    prompt TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Barbers (Berber Listesi)
CREATE TABLE IF NOT EXISTS public.barbers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    rating DECIMAL(3,1),
    specialties TEXT[],
    price_range TEXT,
    phone TEXT,
    instagram_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS (Row Level Security) Aktifleştirme
ALTER TABLE public.users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_baseline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorite_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barbers ENABLE ROW LEVEL SECURITY;

-- Politikalar (Herkes sadece kendi verisini görebilir/düzenleyebilir)
CREATE POLICY "Users can view own profile" ON public.users_profile FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.users_profile FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.users_profile FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own baseline" ON public.user_baseline FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own baseline" ON public.user_baseline FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own moments" ON public.moments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own moments" ON public.moments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own moments" ON public.moments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own favorites" ON public.favorite_styles FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view barbers" ON public.barbers FOR SELECT USING (true);

-- Örnek Berber Verisi (Test için)
INSERT INTO public.barbers (name, city, rating, specialties, price_range)
VALUES 
('The Classic Cut', 'Istanbul', 4.8, ARRAY['Fade', 'Beard Trim'], '$$'),
('Modern Edge', 'Ankara', 4.9, ARRAY['Scissor Cut', 'Styling'], '$$$'),
('Glowé Studio', 'Izmir', 5.0, ARRAY['Full Transformation', 'Color'], '$$$$')
ON CONFLICT DO NOTHING;