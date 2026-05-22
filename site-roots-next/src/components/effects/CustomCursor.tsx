'use client';

import { useEffect, useRef, useCallback } from 'react';
import { gsap } from '@/lib/gsap-register';
import { useHasHover } from '@/hooks/useMediaQuery';

/**
 * Custom Cursor with context-aware morphing.
 * - Outer ring: follows with delay, mix-blend-mode: difference
 * - Inner dot: follows precisely, glow accent
 * - Scales up on interactive elements, hides on mobile
 */
export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const hasHover = useHasHover();
  const mousePos = useRef({ x: -100, y: -100 });
  const outerPos = useRef({ x: -100, y: -100 });
  const isHovering = useRef(false);

  const onMouseMove = useCallback((e: MouseEvent) => {
    mousePos.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    if (!hasHover) return;

    document.body.classList.add('custom-cursor-active');
    window.addEventListener('mousemove', onMouseMove);

    let animId: number;

    const animate = () => {
      // Outer ring — lerp with delay
      outerPos.current.x += (mousePos.current.x - outerPos.current.x) * 0.15;
      outerPos.current.y += (mousePos.current.y - outerPos.current.y) * 0.15;

      if (outerRef.current) {
        outerRef.current.style.transform = `translate(${outerPos.current.x - 20}px, ${outerPos.current.y - 20}px)`;
      }
      if (innerRef.current) {
        innerRef.current.style.transform = `translate(${mousePos.current.x - 4}px, ${mousePos.current.y - 4}px)`;
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    // Premium Event Delegation for Interactive Elements
    // Eliminates MutationObserver overhead and prevents memory leaks
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const interactive = target.closest('a, button, [data-cursor="pointer"], .plan-card, .tier-card, .cta-button, [role="button"]');
      if (interactive && !isHovering.current) {
        isHovering.current = true;
        if (outerRef.current) {
          gsap.to(outerRef.current, {
            width: 60,
            height: 60,
            borderColor: 'rgba(74, 222, 128, 0.5)',
            duration: 0.4,
            ease: 'power3.out',
          });
        }
        if (innerRef.current) {
          gsap.to(innerRef.current, {
            width: 4,
            height: 4,
            duration: 0.4,
            ease: 'power3.out',
          });
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const interactive = target.closest('a, button, [data-cursor="pointer"], .plan-card, .tier-card, .cta-button, [role="button"]');
      if (interactive) {
        const related = e.relatedTarget as HTMLElement;
        if (!related || !interactive.contains(related)) {
          isHovering.current = false;
          if (outerRef.current) {
            gsap.to(outerRef.current, {
              width: 40,
              height: 40,
              borderColor: 'rgba(152, 169, 154, 0.3)',
              duration: 0.4,
              ease: 'power3.out',
            });
          }
          if (innerRef.current) {
            gsap.to(innerRef.current, {
              width: 8,
              height: 8,
              duration: 0.4,
              ease: 'power3.out',
            });
          }
        }
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      document.body.classList.remove('custom-cursor-active');
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [hasHover, onMouseMove]);

  if (!hasHover) return null;

  return (
    <>
      {/* Outer ring */}
      <div
        ref={outerRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full"
        style={{
          width: 40,
          height: 40,
          border: '1px solid rgba(152, 169, 154, 0.3)',
          mixBlendMode: 'difference',
          willChange: 'transform',
        }}
      />
      {/* Inner dot */}
      <div
        ref={innerRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full"
        style={{
          width: 8,
          height: 8,
          backgroundColor: '#4ADE80',
          willChange: 'transform',
          boxShadow: '0 0 10px rgba(74, 222, 128, 0.5)',
        }}
      />
    </>
  );
}
