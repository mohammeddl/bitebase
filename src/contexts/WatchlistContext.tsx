'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';

interface WatchlistItem {
  recipe_id: number;
  recipe_title: string;
  recipe_image: string;
}

interface WatchlistCtx {
  watchlist: WatchlistItem[];
  toggle: (recipeId: number, recipeTitle: string, recipeImage: string) => Promise<void>;
  isSaved: (recipeId: number) => boolean;
  count: number;
  isLoading: boolean;
}

const WatchlistContext = createContext<WatchlistCtx | null>(null);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load watchlist from Supabase on mount
  useEffect(() => {
    const loadWatchlist = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabaseClient.auth.getUser();
        
        if (user) {
          const { data, error } = await supabaseClient
            .from('watchlist')
            .select('recipe_id, recipe_title, recipe_image')
            .eq('user_id', user.id);
          
          if (!error && data) {
            setWatchlist(data);
          }
        } else {
          setWatchlist([]);
        }
      } catch (err) {
        console.error('Failed to load watchlist:', err);
        setWatchlist([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadWatchlist();

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(() => {
      loadWatchlist();
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const toggle = async (recipeId: number, recipeTitle: string, recipeImage: string) => {
    try {
      const { data: { user } } = await supabaseClient.auth.getUser();
      
      if (!user) {
        console.warn('User not authenticated');
        return;
      }

      const isInList = watchlist.some((item) => item.recipe_id === recipeId);

      if (isInList) {
        // Remove from watchlist
        const { error } = await supabaseClient
          .from('watchlist')
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_id', recipeId);
        
        if (!error) {
          setWatchlist(watchlist.filter((item) => item.recipe_id !== recipeId));
        }
      } else {
        // Add to watchlist
        const { error } = await supabaseClient
          .from('watchlist')
          .insert([
            {
              user_id: user.id,
              recipe_id: recipeId,
              recipe_title: recipeTitle,
              recipe_image: recipeImage,
            },
          ]);
        
        if (!error) {
          setWatchlist([...watchlist, { recipe_id: recipeId, recipe_title: recipeTitle, recipe_image: recipeImage }]);
        }
      }
    } catch (err) {
      console.error('Failed to toggle watchlist:', err);
    }
  };

  const isSaved = (recipeId: number) => watchlist.some((item) => item.recipe_id === recipeId);

  return (
    <WatchlistContext.Provider
      value={{ watchlist, toggle, isSaved, count: watchlist.length, isLoading }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error('useWatchlist must be inside WatchlistProvider');
  return ctx;
}
