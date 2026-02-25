import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

/**
 * Auth yönlendirmeleri için doğru URL'i döner.
 * Vercel'de VITE_SITE_URL tanımlı olmalıdır.
 */
export const getURL = () => {
  let url =
    import.meta.env.VITE_SITE_URL ?? // Vercel'de tanımladığın ana URL
    window.location.origin ?? // Tarayıcıdaki mevcut adres
    'http://localhost:8080';
  
  // URL'in sonunda / olduğundan emin ol (Supabase standardı)
  url = url.endsWith('/') ? url : `${url}/`;
  return url;
};