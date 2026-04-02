'use client';

import { useEffect, useRef, useState } from 'react';

export function BackgroundAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Try to play audio - some browsers require user interaction first
    const playAudio = () => {
      audio.volume = 0.1; // Very quiet - for background ambiance
      audio.play().catch(() => {
        // Silently fail if user hasn't interacted with page yet
      });
    };

    // Attempt to play after a brief delay
    const timer = setTimeout(playAudio, 1000);

    // Also try on first user interaction
    const handleInteraction = () => {
      playAudio();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      loop
      preload="none"
      onLoadedData={() => setIsLoaded(true)}
    >
      <source src="/audio/background-ambient.mp3" type="audio/mpeg" />
    </audio>
  );
}
