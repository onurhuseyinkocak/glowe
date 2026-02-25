-- Glowé için tablo güncellemeleri
ALTER TABLE public.users_profile 
ADD COLUMN IF NOT EXISTS identity TEXT,
ADD COLUMN IF NOT EXISTS target_event TEXT,
ADD COLUMN IF NOT EXISTS style_energy TEXT;

ALTER TABLE public.analyses 
RENAME COLUMN face_shape TO glow_face_shape;

ALTER TABLE public.analyses 
ADD COLUMN IF NOT EXISTS glow_score INTEGER DEFAULT 85,
ADD COLUMN IF NOT EXISTS event_type TEXT,
ADD COLUMN IF NOT EXISTS style_energy TEXT,
ADD COLUMN IF NOT EXISTS color_palette JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS outfit_energy TEXT,
ADD COLUMN IF NOT EXISTS makeup_direction TEXT;