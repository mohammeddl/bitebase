'use client';

import { Heart } from 'lucide-react';
import { useWatchlist } from '@/contexts/WatchlistContext';

interface Props {
  slug: string;
  className?: string;
}

export default function WatchlistButton({ slug, className = '' }: Props) {
  const { toggle, isSaved } = useWatchlist();
  const saved = isSaved(slug);

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(slug); }}
      className={`flex items-center justify-center transition-all ${className}`}
      aria-label={saved ? 'Remove from watchlist' : 'Save to watchlist'}
    >
      <Heart
        size={18}
        className={`transition-all duration-300 ${
          saved
            ? 'fill-red-500 text-red-500 scale-110'
            : 'fill-transparent text-white/80 hover:text-red-400'
        }`}
      />
    </button>
  );
}
