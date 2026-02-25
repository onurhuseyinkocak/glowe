import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

/**
 * Auth yönlendirmeleri için mevcut tarayıcı adresini döner.
 * Bu sayede Vercel, Dyad Preview veya Localhost fark etmeksizin doğru yere döner.
 */
export const getURL = () => {
  // window.location.origin o anki tam adresi (https://glowe.vercel.app gibi) verir
  let url = window.location.origin;
  
  // URL'in sonunda / olduğundan emin ol
  url = url.endsWith('/') ? url : `${url}/`;
  return url;
};