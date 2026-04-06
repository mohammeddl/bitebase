'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClickSound } from '@/lib/audioUtils';

export default function FeaturedRecipeCard() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayClick = () => {
    // Play UI click sound
    try {
      createClickSound();
    } catch (e) {
      // Silently fail if audio context not available
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  return (
    <div data-gsap="fade-in">
      <Link
        href="/recipe/salisbury-steak"
        className="lg:w-72 border border-gray-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:border-amber-200 transition-all group"
      >
        <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
          <Image
            src="/images/home/featured-dish.jpg"
            alt="Featured recipe"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">Featured</p>
          <p className="text-sm font-black text-gray-900 leading-tight mb-1 group-hover:text-amber-600 transition-colors">
            Salisbury Steak and Asparagus
          </p>
          {/* Audio waveform with play button */}
          <div className="flex items-center gap-1 my-2">
            {[3, 5, 8, 6, 9, 5, 4, 7, 5, 3, 6, 8, 4].map((h, i) => (
              <div
                key={i}
                className={`w-0.5 rounded-full transition-all duration-300 ${
                  isPlaying ? 'bg-amber-500' : 'bg-gray-300'
                }`}
                style={{ height: `${isPlaying ? h * 1.3 : h}px` }}
              />
            ))}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handlePlayClick();
              }}
              className="w-5 h-5 bg-amber-500 hover:bg-amber-600 rounded-full flex items-center justify-center ml-1 shrink-0 transition-colors"
            >
              <span className="text-white text-[8px]">{isPlaying ? '⏸' : '▶'}</span>
            </button>
          </div>
          <div className="text-xs text-amber-500 font-semibold hover:underline">
            See Recipe →
          </div>
        </div>
      </Link>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnd}
        preload="none"
      >
        <source src="/audio/recipe-intro.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
