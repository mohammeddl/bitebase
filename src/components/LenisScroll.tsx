'use client';

import { useLenis } from '@/hooks/useLenis';
import { ReactNode } from 'react';

export function LenisScroll({ children }: { children: ReactNode }) {
  useLenis();
  
  return <>{children}</>;
}
