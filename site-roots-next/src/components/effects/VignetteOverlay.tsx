'use client';

import { useEffect, useRef } from 'react';
import { useLenis } from '@/hooks/useLenis';

export default function VignetteOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const handleScroll = () => {
      if (!overlayRef.current) return;
      const progress = lenis.progress || 0;
      
      const sectionSize = 1 / 10;
      const sectionProgress = (progress % sectionSize) / sectionSize;
      
      const pulse = Math.sin(sectionProgress * Math.PI);
      
      overlayRef.current.style.opacity = `${0.3 + pulse * 0.4}`;
    };

    lenis.on('scroll', handleScroll);
    return () => {
      lenis.off('scroll', handleScroll);
    };
  }, [lenis]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 pointer-events-none z-[5]"
      style={{
        background: 'radial-gradient(circle at center, transparent 40%, rgba(10, 15, 13, 0.8) 100%)',
        opacity: 0.3,
        transition: 'opacity 0.1s linear',
      }}
    />
  );
}
