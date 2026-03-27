'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const STORAGE_KEY = 'bitebase_watchlist';

interface WatchlistCtx {
  watchlist: string[]; // array of recipe slugs
  toggle: (slug: string) => void;
  isSaved: (slug: string) => boolean;
  count: number;
}

const WatchlistContext = createContext<WatchlistCtx | null>(null);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setWatchlist(JSON.parse(stored));
    } catch {}
  }, []);

  const persist = (list: string[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    setWatchlist(list);
  };

  const toggle = (slug: string) => {
    persist(
      watchlist.includes(slug)
        ? watchlist.filter((s) => s !== slug)
        : [...watchlist, slug]
    );
  };

  const isSaved = (slug: string) => watchlist.includes(slug);

  return (
    <WatchlistContext.Provider value={{ watchlist, toggle, isSaved, count: watchlist.length }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error('useWatchlist must be inside WatchlistProvider');
  return ctx;
}
