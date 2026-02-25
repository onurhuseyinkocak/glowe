-- 1. User Profile (Gelişmiş Profil)
CREATE TABLE IF NOT EXISTS public.user_profile (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    identity TEXT CHECK (identity IN ('woman', 'man', 'non-binary', 'unspecified')),
    style_energy TEXT CHECK (style_energy IN ('soft', 'bold', 'elegant', 'natural', 'trendy')),
    hair_coverage TEXT CHECK (hair_coverage IN ('visible', 'partial', 'covered', 'unspecified')),
    baseline_preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Wardrobe Items (Gardırop)
CREATE TABLE IF NOT EXISTS public.wardrobe_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    category TEXT NOT NULL, -- top, bottom, dress, shoes, outerwear, accessory, hijab
    color_tags JSONB DEFAULT '[]'::jsonb,
    style_tags JSONB DEFAULT '[]'::jsonb,
    season_tags JSONB DEFAULT '[]'::jsonb,
    image_path TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Outfits (Kombinler)
CREATE TABLE IF NOT EXISTS public.outfits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT,
    item_ids JSONB DEFAULT '[]'::jsonb,
    occasion_tags JSONB DEFAULT '[]'::jsonb,
    image_path TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Look Plans (Günlük Planlar)
CREATE TABLE IF NOT EXISTS public.look_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    occasion TEXT,
    context JSONB DEFAULT '{}'::jsonb, -- location, weather, time, formality, vibe
    recommended_outfit JSONB DEFAULT '{}'::jsonb,
    makeup_or_grooming JSONB DEFAULT '{}'::jsonb,
    accessories_or_hijab JSONB DEFAULT '{}'::jsonb,
    rationale TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Etkinleştirme
ALTER TABLE public.user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wardrobe_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.look_plans ENABLE ROW LEVEL SECURITY;

-- RLS Politikaları (Owner-only)
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can manage own profile" ON public.user_profile;
    CREATE POLICY "Users can manage own profile" ON public.user_profile FOR ALL USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Users can manage own wardrobe" ON public.wardrobe_items;
    CREATE POLICY "Users can manage own wardrobe" ON public.wardrobe_items FOR ALL USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Users can manage own outfits" ON public.outfits;
    CREATE POLICY "Users can manage own outfits" ON public.outfits FOR ALL USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Users can manage own look plans" ON public.look_plans;
    CREATE POLICY "Users can manage own look plans" ON public.look_plans FOR ALL USING (auth.uid() = user_id);
END $$;