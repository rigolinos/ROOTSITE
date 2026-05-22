'use client';

import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-register';
import { MOTION } from '@/lib/animations';

/**
 * Scroll Indicator with fade-out in first 15% of scroll.
 */
export default function ScrollIndicator() {
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = indicatorRef.current;
    if (!el) return;

    // Entrance animation (after hero text completes ~2.5s)
    gsap.set(el, { opacity: 0, y: 20 });
    gsap.to(el, {
      opacity: 0.5,
      y: 0,
      duration: MOTION.duration.default,
      ease: MOTION.ease.fade,
      delay: 2.5,
    });

    // ScrollTrigger: fade out in first 15% of scroll
    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: '15% top',
      scrub: true,
      animation: gsap.to(el, {
        opacity: 0,
        y: -20,
        duration: 1,
      }),
    });

    return () => {
      st.kill();
    };
  }, []);

  return (
    <div
      ref={indicatorRef}
      className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
    >
      <span
        className="text-sage uppercase"
        style={{
          fontSize: '0.7rem',
          letterSpacing: '0.3em',
          fontWeight: 500,
        }}
      >
        Scroll
      </span>
      <div
        className="w-px h-10 animate-scroll-pulse"
        style={{
          background: 'linear-gradient(to bottom, #98A99A, transparent)',
        }}
      />
    </div>
  );
}
