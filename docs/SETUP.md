# Glowé Production Setup Guide

Follow these steps to get Glowé running in your production environment.

## 1. Environment Variables
Create a `.env` file in the root directory with the following keys:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SITE_URL=your_app_base_url (e.g., https://glowe.app)
```

## 2. Supabase Configuration

### Authentication
1. Go to **Authentication -> Providers**.
2. **Google**: Enable and add your Client ID and Secret from Google Cloud Console.
3. **Apple**: Enable and configure with your Apple Developer Service ID.
4. **Redirect URLs**: Add `https://your-project-ref.supabase.co/auth/v1/callback` and your site URL.

### Storage
1. Create a new bucket named `selfies`.
2. Set it to **Private**.
3. Add a policy allowing authenticated users to upload and read their own files.

### Database
Run the provided SQL migrations in the Supabase SQL Editor to create `users_profile` and `analyses` tables with RLS policies.

## 3. Smoke Test Checklist
- [ ] Google login redirects and creates session.
- [ ] Apple login works on iOS.
- [ ] Onboarding steps persist to `users_profile`.
- [ ] Selfie upload to `selfies` bucket successful.
- [ ] Glow Engine generates deterministic plan.
- [ ] Results screen shows Glow Score™ and palette.
- [ ] Logout clears session and routes to Auth.
- [ ] Diagnostics screen accessible via 5 taps on version.

## 4. Design System
Glowé uses a custom Tailwind configuration:
- **Base**: Off-white (`#FFFBFA`)
- **Accent**: Soft Rose (`#E8D5D8`)
- **Secondary**: Warm Beige (`#F5F0E1`)
- **Typography**: Playfair Display (Serif) & Inter (Sans)