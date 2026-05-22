'use client';

import { createContext, useContext } from 'react';
import type Lenis from 'lenis';

export const LenisContext = createContext<Lenis | null>(null);

/**
 * Hook to access the global Lenis smooth scroll instance.
 * Must be used within <SmoothScrollProvider>.
 */
export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}
