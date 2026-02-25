# Glowé Presence OS Setup Guide

## 1. Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SITE_URL=https://glowe.vercel.app
```

## 2. Supabase Auth Configuration
1. Go to **Authentication > URL Configuration**.
2. Set **Site URL** to `https://glowe.vercel.app`.
3. Add `https://glowe.vercel.app/**` to **Redirect URLs**.
4. For Google/Apple Auth: Enable them in **Authentication > Providers** and enter your Client IDs.

## 3. Supabase Storage
1. Create bucket: `selfies` (Private).
2. Add RLS: `(auth.uid() = (storage.foldername(name))[1])`.

## 4. Smoke Test
- [ ] Baseline setup completes and saves to `user_baseline`.
- [ ] Home screen shows moment types.
- [ ] Moment intake generates a plan.
- [ ] Results screen displays all modules correctly.
- [ ] Diagnostics screen (5 taps on version in Settings) shows system status.