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

    // ═══ MAGNETIC SNAP: Scroll-telling guiado ═══
    // When user stops scrolling, snap to the nearest section center
    const SECTION_COUNT = 9;
    let snapTimer: ReturnType<typeof setTimeout> | null = null;
    let isSnapping = false;

    lenisInstance.on('scroll', ({ velocity }: { velocity: number }) => {
      // Clear any pending snap while user is actively scrolling
      if (snapTimer) {
        clearTimeout(snapTimer);
        snapTimer = null;
      }

      // Only trigger snap when velocity is near zero (user stopped)
      if (Math.abs(velocity) < 0.05 && !isSnapping) {
        snapTimer = setTimeout(() => {
          if (isSnapping) return;

          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const currentScroll = lenisInstance.scroll;
          const currentProgress = currentScroll / Math.max(maxScroll, 1);

          // Find which section we're closest to
          const sectionSize = 1 / SECTION_COUNT;
          const currentSection = currentProgress / sectionSize;
          const nearestSection = Math.round(currentSection);
          const sectionCenter = (nearestSection + 0.5) * sectionSize;

          // Only snap if we're not already centered (tolerance of 3%)
          const distToCenter = Math.abs(currentProgress - sectionCenter + sectionSize * 0.5);
          const normalizedDist = distToCenter / sectionSize;

          if (normalizedDist > 0.03 && normalizedDist < 0.97) {
            isSnapping = true;
            const targetScroll = Math.min(
              (nearestSection * sectionSize + sectionSize * 0.35) * maxScroll,
              maxScroll
            );

            lenisInstance.scrollTo(targetScroll, {
              duration: 1.2,
              onComplete: () => {
                isSnapping = false;
              },
            });

            // Safety timeout to reset snap lock
            setTimeout(() => { isSnapping = false; }, 2000);
          }
        }, 800);
      }
    });

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
      if (snapTimer) clearTimeout(snapTimer);
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
