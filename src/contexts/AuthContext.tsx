'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  avatar: string | null; // base64 or URL
  bio: string;
}

interface AuthState {
  user: UserProfile | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthState | null>(null);

const STORAGE_KEY = 'bitebase_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {}
  }, []);

  const persist = (u: UserProfile | null) => {
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
    setUser(u);
  };

  const login = async (email: string, _password: string) => {
    // Simulated auth — in production connect to real backend
    const profile: UserProfile = {
      name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      email,
      avatar: null,
      bio: '',
    };
    persist(profile);
  };

  const register = async (name: string, email: string, _password: string) => {
    const profile: UserProfile = { name, email, avatar: null, bio: '' };
    persist(profile);
  };

  const loginWithGoogle = async () => {
    const profile: UserProfile = {
      name: 'Google User',
      email: 'user@gmail.com',
      avatar: null,
      bio: '',
    };
    persist(profile);
  };

  const logout = () => persist(null);

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    persist(updated);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, register, loginWithGoogle, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
