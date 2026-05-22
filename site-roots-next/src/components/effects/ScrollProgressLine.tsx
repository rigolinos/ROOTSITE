'use client';

import { useEffect, useRef } from 'react';
import { useLenis } from '@/hooks/useLenis';

/**
 * Scroll Progress Line — thin bar at top showing scroll position.
 */
export default function ScrollProgressLine() {
  const lineRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const handleScroll = () => {
      if (!lineRef.current) return;
      const progress = lenis.progress || 0;
      lineRef.current.style.transform = `scaleX(${progress})`;
    };

    lenis.on('scroll', handleScroll);

    return () => {
      lenis.off('scroll', handleScroll);
    };
  }, [lenis]);

  return (
    <div
      ref={lineRef}
      className="fixed top-0 left-0 z-[9997] h-[2px] w-full origin-left pointer-events-none"
      style={{
        transform: 'scaleX(0)',
        background: 'linear-gradient(90deg, #4ADE80, #98A99A)',
        boxShadow: '0 0 10px rgba(74, 222, 128, 0.5), 0 0 20px rgba(74, 222, 128, 0.2)',
        willChange: 'transform',
      }}
    />
  );
}
