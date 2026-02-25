-- Kullanıcı Temel Ayarları (Baseline)
CREATE TABLE IF NOT EXISTS public.user_baseline (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    identity TEXT,
    presentation_goal TEXT,
    hair_coverage TEXT,
    lifestyle_contexts JSONB,
    beauty_comfort TEXT,
    wardrobe_preference TEXT,
    core_priority TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Anlar (Moments)
CREATE TABLE IF NOT EXISTS public.moments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    moment_type TEXT,
    context_modifiers JSONB,
    glow_score INTEGER,
    plan_json JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Şablonlar
CREATE TABLE IF NOT EXISTS public.moment_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    moment_type TEXT,
    context_modifiers JSONB,
    plan_json JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Geri Bildirim
CREATE TABLE IF NOT EXISTS public.moment_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    moment_id UUID REFERENCES public.moments(id) ON DELETE CASCADE,
    feel_rating INTEGER CHECK (feel_rating >= 1 AND feel_rating <= 5),
    compliments BOOLEAN,
    camera_confidence BOOLEAN,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Politikaları
ALTER TABLE public.user_baseline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moment_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moment_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own baseline" ON public.user_baseline FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own moments" ON public.moments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own templates" ON public.moment_templates FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own feedback" ON public.moment_feedback FOR ALL USING (auth.uid() = user_id);