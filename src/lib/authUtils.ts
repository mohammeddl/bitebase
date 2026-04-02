import { supabaseClient } from './supabaseClient';

export type UserProfile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
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
      redirectTo: `${window.location.origin}/auth/callback`,
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

// Get current user
export async function getCurrentUser() {
  const { data, error } = await supabaseClient.auth.getUser();
  if (error) throw error;
  return data.user;
}

// Get user profile
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
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
