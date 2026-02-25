-- Saç örtme tercihi için kolon ekleme
ALTER TABLE public.users_profile 
ADD COLUMN IF NOT EXISTS hair_coverage TEXT DEFAULT 'visible';

ALTER TABLE public.analyses 
ADD COLUMN IF NOT EXISTS hair_coverage TEXT DEFAULT 'visible',
ADD COLUMN IF NOT EXISTS styling_direction TEXT,
ADD COLUMN IF NOT EXISTS fabric_suggestions TEXT,
ADD COLUMN IF NOT EXISTS wrap_structure TEXT;