import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

// OAuth yönlendirme URL'i (Geliştirme ve Prodüksiyon için)
export const getURL = () => {
  let url =
    import.meta.env.VITE_SITE_URL ?? // Değişken tanımlıysa kullan
    window.location.origin ?? // Tarayıcı origin'ini kullan
    'http://localhost:8080';
  
  // URL'in sonunda / olduğundan emin ol
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
  return url;
};