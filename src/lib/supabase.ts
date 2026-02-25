import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

/**
 * Auth yönlendirmeleri için mevcut tarayıcı adresini döner.
 * window.location.origin kullanımı Vercel/Local farkını ortadan kaldırır.
 */
export const getURL = () => {
  let url = typeof window !== 'undefined' ? window.location.origin : '';
  url = url.endsWith('/') ? url : `${url}/`;
  return url;
};