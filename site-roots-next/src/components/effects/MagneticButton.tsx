'use client';

import { useRef, useCallback, type ReactNode } from 'react';
import { gsap } from '@/lib/gsap-register';
import { useHasHover } from '@/hooks/useMediaQuery';
import { MOTION } from '@/lib/animations';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

/**
 * Magnetic Button — subtly attracts toward cursor on hover.
 * Disabled on touch devices.
 */
export default function MagneticButton({
  children,
  className = '',
  strength = 0.3,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const hasHover = useHasHover();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!hasHover || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(ref.current, {
        x: x * strength,
        y: y * strength,
        duration: MOTION.duration.min,
        ease: MOTION.ease.fade,
      });
    },
    [hasHover, strength]
  );

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: MOTION.duration.default,
      ease: MOTION.ease.elastic,
    });
  }, []);

  return (
    <div
      ref={ref}
      className={`will-change-transform inline-block ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
