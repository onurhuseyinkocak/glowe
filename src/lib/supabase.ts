import { createClient } from '@supabase/supabase-js';

// These variables are populated when you connect Supabase via the integration button
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Please connect Supabase via the integration button above the chat.');
}

// Use placeholders to prevent initialization crash if variables are missing
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);