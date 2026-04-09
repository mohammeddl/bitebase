'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import * as authUtils from '@/lib/authUtils';

export interface UserProfile {
  id?: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  role: 'user' | 'admin';
}

interface AuthState {
  user: UserProfile | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper: build a basic user from Supabase session (no DB required)
  const userFromSession = (sessionUser: any): UserProfile => ({
    id: sessionUser.id,
    full_name:
      sessionUser.user_metadata?.full_name ||
      sessionUser.email?.split('@')[0] ||
      'User',
    email: sessionUser.email || '',
    avatar_url: sessionUser.user_metadata?.avatar_url || null,
    role: 'user',
  });

  // Sync with Supabase auth state on mount
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabaseClient.auth.getSession();

        if (session?.user && mounted) {
          // 1. Start with session data as a base
          const initialUser = userFromSession(session.user);
          setUser(initialUser);

          // 2. ✅ Await DB enrichment to get the correct role
          try {
            const profile = await authUtils.getUserProfile(session.user.id);
            if (profile && mounted) {
              setUser({
                id: session.user.id,
                full_name: profile.full_name || initialUser.full_name,
                email: profile.email || initialUser.email,
                avatar_url: profile.avatar_url || initialUser.avatar_url,
                role: profile.role || 'user',
              });
            }
          } catch (profileErr) {
            console.error('[AuthContext] Profile enrichment failed:', profileErr);
            // Non-fatal: user stays logged in with session-based 'user' role
          }
        }
      } catch (err) {
        console.error('[AuthContext] Auth initialization failed:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    initAuth();

    // Subscribe to real-time auth changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (session?.user) {
        const initialUser = userFromSession(session.user);
        setUser(initialUser);

        // Enrichment
        try {
          const profile = await authUtils.getUserProfile(session.user.id);
          if (profile && mounted) {
            setUser({
              id: session.user.id,
              full_name: profile.full_name || initialUser.full_name,
              email: profile.email || initialUser.email,
              avatar_url: profile.avatar_url || initialUser.avatar_url,
              role: profile.role || 'user',
            });
          }
        } catch (err) {
          console.error('[AuthContext] Auth change profile sync failed:', err);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await authUtils.signInWithEmail(email, password);
      const { data: { user: authUser } } = await supabaseClient.auth.getUser();
      if (authUser) {
        const profile = await authUtils.getUserProfile(authUser.id);
        if (profile) {
          setUser({
            id: authUser.id,
            full_name: profile.full_name || '',
            email: profile.email || '',
            avatar_url: profile.avatar_url || null,
            role: profile.role || 'user',
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      await authUtils.signUpWithEmail(email, password, name);
      const { data: { user: authUser } } = await supabaseClient.auth.getUser();
      if (authUser) {
        const profile = await authUtils.getUserProfile(authUser.id);
        if (profile) {
          setUser({
            id: authUser.id,
            full_name: profile.full_name || '',
            email: profile.email || '',
            avatar_url: profile.avatar_url || null,
            role: profile.role || 'user',
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      await authUtils.signInWithGoogle();
      // User will be redirected to /auth/callback which handles the rest
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      await authUtils.resetPasswordForEmail(email);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await supabaseClient.auth.signOut();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      await authUtils.updateUserProfile(user.id, {
        full_name: updates.full_name || user.full_name,
        avatar_url: updates.avatar_url ?? user.avatar_url,
      });
      
      setUser({
        ...user,
        ...updates,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        login,
        register,
        loginWithGoogle,
        resetPassword,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
