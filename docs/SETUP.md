# Glowé Presence OS Setup Guide

## 1. Environment Variables
```env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
VITE_SITE_URL=https://glowe.app
```

## 2. RevenueCat Setup (Subscription)
1. Create a project in RevenueCat.
2. Add iOS/Android apps.
3. Create Entitlement: `pro`.
4. Create Offerings: `Monthly ($7.99)`, `Yearly ($59.99)`.
5. Copy API Keys to your app config.

## 3. Supabase Storage
1. Create bucket: `selfies` (Private).
2. Add RLS: `(auth.uid() = (storage.foldername(name))[1])`.

## 4. Smoke Test
- [ ] Baseline setup completes and saves to `user_baseline`.
- [ ] Home screen shows moment types.
- [ ] Moment intake generates a plan with Voice/Camera modules for Creator types.
- [ ] Results screen displays all modules correctly.
- [ ] Paywall appears after 3rd plan (Free tier limit).
- [ ] Diagnostics screen (5 taps on version) shows system status.