-- Create tables for CutMatch MVP

-- 1. Users Profile
CREATE TABLE IF NOT EXISTS public.users_profile (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    gender TEXT,
    age_range TEXT,
    hair_texture TEXT,
    hair_density TEXT,
    hairline TEXT,
    style_vibe TEXT,
    maintenance TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Barbers Directory
CREATE TABLE IF NOT EXISTS public.barbers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    rating NUMERIC(3,2) DEFAULT 5.0,
    price_range TEXT DEFAULT '$$',
    specialties JSONB DEFAULT '[]'::jsonb,
    instagram_url TEXT,
    phone TEXT,
    lat NUMERIC,
    lng NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Analyses
CREATE TABLE IF NOT EXISTS public.analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    selfie_path TEXT,
    selfie_public_url TEXT,
    status TEXT DEFAULT 'uploaded', -- uploaded, processing, done, failed
    is_mock BOOLEAN DEFAULT TRUE,
    face_shape TEXT,
    hair_notes TEXT,
    best_cut TEXT,
    alt_cuts JSONB DEFAULT '[]'::jsonb,
    barber_instructions TEXT,
    why_it_works TEXT,
    share_title TEXT,
    share_hashtags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

-- Users Profile: Own row only
CREATE POLICY "Users can view own profile" ON public.users_profile FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.users_profile FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.users_profile FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Barbers: Public read
CREATE POLICY "Public can view barbers" ON public.barbers FOR SELECT USING (true);

-- Analyses: Own rows only
CREATE POLICY "Users can view own analyses" ON public.analyses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own analyses" ON public.analyses FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Seed Barbers
INSERT INTO public.barbers (name, city, rating, price_range, specialties, instagram_url, phone)
VALUES 
('The Gentlemans Cut', 'Austin', 4.9, '$$$', '["Fades", "Beard Trim"]', 'https://instagram.com', '512-555-0101'),
('Shed Barber Supply', 'Austin', 4.8, '$$', '["Classic Cuts", "Straight Razor"]', 'https://instagram.com', '512-555-0102'),
('Finley''s Barbershop', 'Austin', 4.7, '$$', '["Hot Towel Shave", "Scissor Cut"]', 'https://instagram.com', '512-555-0103'),
('Bearded Lady', 'Austin', 4.9, '$$$', '["Modern Styles", "Coloring"]', 'https://instagram.com', '512-555-0104'),
('South Austin Barbers', 'Austin', 4.6, '$', '["Buzz Cuts", "Quick Fades"]', 'https://instagram.com', '512-555-0105'),
('Miami Vice Cuts', 'Miami', 4.9, '$$$', '["Taper Fades", "Design Work"]', 'https://instagram.com', '305-555-0101'),
('The Spot Barbershop', 'Miami', 4.8, '$$', '["Executive Cuts", "Facials"]', 'https://instagram.com', '305-555-0102'),
('RazzleDazzle Barbershop', 'Miami', 4.7, '$$$', '["Vintage Experience", "Shaves"]', 'https://instagram.com', '305-555-0103'),
('Churchill''s Barber Shop', 'Miami', 4.9, '$$$$', '["Luxury Grooming", "Manicures"]', 'https://instagram.com', '305-555-0104'),
('Proper Trim', 'Miami', 4.6, '$$', '["Skin Fades", "Lineups"]', 'https://instagram.com', '305-555-0105');