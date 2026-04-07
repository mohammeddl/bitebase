import { supabaseClient } from './supabaseClient';

export type UserProfile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
  created_at: string;
};

// Helper to get the correct site URL for redirects
const getURL = () => {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ?? // Set this to https://bitebase.me in production
    process.env.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel
    'https://bitebase.me'; // Your official production domain
  
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:3000';
  }

  // Make sure to include `https://` when not localhost
  url = url.includes('http') ? url : `https://${url}`;
  // Make sure to remove trailing slash
  url = url.charAt(url.length - 1) === '/' ? url.slice(0, -1) : url;
  return url;
};

// Sign up with email and password
export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string
) {
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${getURL()}/auth/callback`,
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw error;
  return data;
}

// Sign in with email and password
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

// Sign in with Google
export async function signInWithGoogle() {
  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${getURL()}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
}

// Sign out
export async function signOut() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) throw error;
}

// Request password reset email
export async function resetPasswordForEmail(email: string) {
  const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: `${getURL()}/auth/update-password`,
  });
  if (error) throw error;
  return data;
}

// Update password (used when in a valid recovery session)
export async function updatePassword(password: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const { data, error } = await supabaseClient.auth.updateUser({
        password: password,
      });
      if (error) throw error;
      return data;
    } catch (err: any) {
      const isLockError = err.message?.includes('Lock') || err.message?.includes('stole it');
      if (isLockError && i < retries - 1) {
        // Wait 500ms before retrying
        await new Promise(resolve => setTimeout(resolve, 500));
        continue;
      }
      throw err;
    }
  }
}

// Get current user
export async function getCurrentUser() {
  const { data, error } = await supabaseClient.auth.getUser();
  if (error) throw error;
  return data.user;
}

// Get user profile
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // If no profile exists, try to get user metadata and return a virtual profile or create one
    if (error?.code === 'PGRST116' || !data) {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (user) {
        const fallbackProfile: UserProfile = {
          id: userId,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          avatar_url: user.user_metadata?.avatar_url || null,
          role: 'user', // Default role
          created_at: new Date().toISOString(),
        };

        // Attempt to create the profile record if it really doesn't exist
        // We use .insert().select().single() and catch error in case the trigger already created it
        try {
          const { data: createdProfile, error: insertError } = await supabaseClient
            .from('profiles')
            .insert([{
              id: userId,
              email: fallbackProfile.email,
              full_name: fallbackProfile.full_name,
              avatar_url: fallbackProfile.avatar_url,
              role: 'user'
            }])
            .select()
            .single();
          
          if (!insertError && createdProfile) return createdProfile;
          
          // If insert failed (e.g. already exists), try fetching one last time
          if (insertError) {
             const { data: lastTry } = await supabaseClient
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .single();
             if (lastTry) return lastTry;
          }
        } catch (e) {
          console.error('Silent error during profile sync:', e);
        }
        
        return fallbackProfile;
      }
      return null;
    }

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error getting user profile:', err);
    return null;
  }
}

// Update user profile with avatar
export async function updateUserProfile(
  userId: string,
  { full_name, avatar_url }: { full_name?: string; avatar_url?: string | null }
) {
  const { data, error } = await supabaseClient
    .from('profiles')
    .update({ full_name, avatar_url })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Upload avatar image
export async function uploadAvatar(
  userId: string,
  file: File
): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Math.random()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { error: uploadError } = await supabaseClient.storage
    .from('user-avatars')
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabaseClient.storage
    .from('user-avatars')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

// Watch auth changes
export function onAuthStateChange(
  callback: (event: string, session: any) => void
) {
  return supabaseClient.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}
