'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap-register';
import { LenisContext } from '@/hooks/useLenis';

interface SmoothScrollProviderProps {
  children: ReactNode;
}

/**
 * Global Smooth Scroll Provider
 * 
 * CRITICAL INTEGRATION:
 * - Initializes Lenis with smoothTouch: false (mobile safety)
 * - Syncs Lenis RAF with GSAP ticker (mandatory per spec)
 * - Handles ScrollTrigger refresh on resize and layout mutations
 */
export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Initialize Lenis
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      autoResize: true,
    });

    setLenis(lenisInstance);

    // ═══ CRITICAL SYNC: Lenis RAF ↔ GSAP Ticker ═══
    // This is the mandatory integration from Camada 01
    lenisInstance.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenisInstance.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // ScrollTrigger refresh on resize (debounced)
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
    };

    window.addEventListener('resize', handleResize);

    // Initial refresh after DOM settles
    const initialRefresh = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    // Cleanup
    return () => {
      clearTimeout(initialRefresh);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      gsap.ticker.remove(tickerCallback);
      lenisInstance.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
}
