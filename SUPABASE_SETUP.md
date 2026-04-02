# Supabase Setup Guide for BiteBase

Complete guide to set up authentication and database for your recipe app.

## Step 1: Supabase Project Setup ✅ (Already Done)

Your project is created with:
- Project name: `recipe`
- Region: Europe
- RLS (Row Level Security): Enabled
- API Keys configured in `.env.local`

## Step 2: Create Database Tables

In Supabase Dashboard → SQL Editor, run this:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create storage bucket for avatars
-- Go to Storage > Create new bucket > "user-avatars" (public)

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create watchlist table (optional - for saving recipes)
CREATE TABLE watchlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id INTEGER,
  recipe_title TEXT,
  recipe_image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, recipe_id)
);

-- NOTE: If you already have the watchlist table, run this instead:
-- ALTER TABLE watchlist ADD COLUMN recipe_image TEXT;

ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own watchlist"
  ON watchlist FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their watchlist"
  ON watchlist FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from watchlist"
  ON watchlist FOR DELETE
  USING (auth.uid() = user_id);
```

## Step 3: Enable Google OAuth

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable **Google**
3. Set up Google OAuth:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create OAuth 2.0 credentials (Web application)
   - **Authorized redirect URIs:**
     ```
     https://your-project.supabase.co/auth/v1/callback
     http://localhost:3000/auth/callback
     ```
   - Copy Client ID and Client Secret
   - Paste into Supabase Google provider settings

## Step 4: Update .env.local

Replace placeholder URL with your actual Supabase URL:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SECRET_KEY=your_secret_key_here
```

## Step 5: Create Storage Bucket for Avatars

1. Supabase Dashboard → Storage
2. Click "Create new bucket"
3. Name: `user-avatars`
4. Access level: Public
5. Click Create

## Step 6: Automated Profile Creation (Recommended)

To ensure a profile is created immediately when a user signs up (even before email confirmation), run this in your SQL Editor:

```sql
-- Trigger to create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Step 7: Password Reset Configuration

1. **Supabase Dashboard** → **Authentication** → **Email Templates**.
2. Select **Reset Password**.
3. In the **Redirect URL** field, make sure it points to your password update page:
   ```
   {{ .SiteURL }}/auth/callback?next=/auth/update-password
   ```
   *Note: If you are using the default Redirect URL, Supabase will handle this via the `redirectTo` option in the code, but it's good to ensure `http://localhost:3000/auth/update-password` is in your **Redirect URIs** list.*

4. Go to **Authentication** → **URL Configuration**.
5. Add `http://localhost:3000/auth/update-password` to the **Redirect URIs** if it's not already covered by a wildcard.

## Features Now Available

✅ **Email/Password Authentication**
- Sign up page: `/auth/signup`
- Login page: `/auth/login`
- Profile page: `/profile`

✅ **Google OAuth**
- One-click Google login
- Auto profile creation
- Avatar from Google account

✅ **User Profiles**
- Full name
- Custom avatar upload
- Email verification

✅ **Database**
- User data persists
- Watchlist for saved recipes
- RLS for security

## Testing Locally

1. Run dev server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000`

3. Click "Sign Up" → Create account

4. Or use Google to sign in

5. Upload profile picture

6. View saved profile data in `/profile`

## Common Issues & Fixes

**Issue: "project not found"**
- Check `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`
- Make sure it includes `https://`

**Issue: "Invalid API key"**
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Don't use secret key in frontend

**Issue: "Google login fails"**
- Check redirect URI matches in Google Console
- Use `http://localhost:3000` for local testing
- Use `https://your-domain.com` for production

**Issue: "Upload fails"**
- Make sure bucket is created and public
- File must be under 5MB
- Supported: JPG, PNG, GIF

## Next Steps

After setup:
1. Test email/password signup
2. Test Google OAuth login
3. Test avatar upload
4. Connect watchlist table for saved recipes
5. Deploy to production

## Production Deployment

When deploying:
1. Update `NEXT_PUBLIC_SUPABASE_URL` with production URL
2. Add production domain to Google OAuth Redirect URIs
3. Enable custom domain if needed
4. Set up automated backups
5. Monitor auth logs

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google)
