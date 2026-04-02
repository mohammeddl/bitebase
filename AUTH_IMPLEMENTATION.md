# BiteBase Authentication System - Complete Setup

## Files Created

### Core Supabase Files
- `src/lib/supabaseClient.ts` - Supabase client initialization
- `src/lib/authUtils.ts` - Authentication utility functions
  - Sign up/login with email
  - Google OAuth
  - Avatar upload
  - Profile management

### Authentication Pages
- `src/app/auth/signup/page.tsx` - Sign up page
- `src/app/auth/login/page.tsx` - Login page  
- `src/app/auth/callback/page.tsx` - Google OAuth callback

### Components
- `src/components/AuthSignUp.tsx` - Sign up form with email & Google
- `src/components/AuthLogin.tsx` - Login form with email & Google

### Documentation
- `SUPABASE_SETUP.md` - Complete setup guide

## Features Implemented

### 1. User Authentication ✅
- **Email/Password Signup** - Create account with email & password
- **Email/Password Login** - Sign in with credentials
- **Google OAuth** - One-click Google signin
- **Session Management** - Automatic session handling
- **Sign Out** - Logout functionality

### 2. User Profiles ✅
- **Profile Data** - Store full name, email, avatar
- **Avatar Upload** - Upload custom profile pictures
- **Profile Page** - View and edit profile at `/profile`
- **Auto-profile** - Profile auto-created on signup

### 3. Security ✅
- **Row Level Security (RLS)** - Users can only see their own data
- **Secure Keys** - Publishable key for browser, secret for server
- **OAuth Standards** - Google OAuth 2.0
- **Database Encryption** - Supabase handles encryption

## How to Use

### For Users

**Sign Up:**
1. Click "Sign Up" button on navbar
2. Enter email, password, full name
3. Click "Create Account"
4. Upload profile picture
5. Done! Account created

**Login:**
1. Click "Sign In" button
2. Enter email & password OR click "Google"
3. Redirected to profile
4. View/edit profile settings

### For Developers

**Get Current User:**
```typescript
import { getCurrentUser } from '@/lib/authUtils';
const user = await getCurrentUser();
```

**Get User Profile:**
```typescript
import { getUserProfile } from '@/lib/authUtils';
const profile = await getUserProfile(userId);
```

**Update Profile:**
```typescript
import { updateUserProfile } from '@/lib/authUtils';
await updateUserProfile(userId, {
  full_name: 'John Doe',
  avatar_url: 'https://...'
});
```

**Upload Avatar:**
```typescript
import { uploadAvatar } from '@/lib/authUtils';
const url = await uploadAvatar(userId, fileObject);
```

## Setup Checklist

- [ ] Create database tables (see SUPABASE_SETUP.md)
- [ ] Create `user-avatars` storage bucket
- [ ] Set up Google OAuth credentials
- [ ] Add Google OAuth Redirect URIs
- [ ] Update `.env.local` with project URL
- [ ] Test email signup at `/auth/signup`
- [ ] Test login at `/auth/login`
- [ ] Test Google OAuth
- [ ] Test avatar upload at `/profile`
- [ ] Test profile editing

## Routes Available

| Route | Purpose | Auth Required |
|-------|---------|---------------|
| `/auth/signup` | Create new account | No |
| `/auth/login` | Sign in to account | No |
| `/auth/callback` | Google OAuth callback | No |
| `/profile` | View/edit profile | Yes |
| `/` | Home page | No |

## Environment Variables

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
```

## Next Phase

Ready to:
- [ ] Integrate watchlist with Supabase database
- [ ] Add user preferences
- [ ] Store rated recipes
- [ ] Add social features
- [ ] Deploy to production

## Support

For issues:
1. Check `SUPABASE_SETUP.md` troubleshooting section
2. View Supabase logs in Dashboard
3. Check browser console for errors
4. Verify `.env.local` variables
