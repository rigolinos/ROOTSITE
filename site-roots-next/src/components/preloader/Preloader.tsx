'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from '@/lib/gsap-register';
import { MOTION } from '@/lib/animations';

/**
 * Cinematic Preloader
 * Leaf SVG draws + progress bar + status text → fade out
 */
export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const leafRef = useRef<SVGSVGElement>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const bar = barRef.current;
    const status = statusRef.current;
    const leaf = leafRef.current;

    if (!container || !bar || !status || !leaf) return;

    const veins = leaf.querySelectorAll('.preloader-vein');
    const leafPath = leaf.querySelector('.preloader-leaf') as SVGPathElement;

    // Initial states
    if (leafPath) {
      const len = leafPath.getTotalLength();
      gsap.set(leafPath, { strokeDasharray: len, strokeDashoffset: len });
    }
    gsap.set(veins, { strokeDasharray: 80, strokeDashoffset: 80 });

    // Progress timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out preloader
        gsap.to(container, {
          opacity: 0,
          duration: MOTION.duration.min,
          ease: MOTION.ease.fade,
          onComplete: () => {
            setCompleted(true);
            document.body.classList.add('loaded');
          },
        });
      },
    });

    // Leaf outline draws
    if (leafPath) {
      tl.to(leafPath, {
        strokeDashoffset: 0,
        duration: 1.2,
        ease: MOTION.ease.reveal,
      });
    }

    // Progress bar
    tl.to(bar, {
      width: '100%',
      duration: 1.5,
      ease: MOTION.ease.fade,
    }, '-=0.8');

    // Veins
    tl.to(veins, {
      strokeDashoffset: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: MOTION.ease.slide,
    }, '-=1.0');

    // Status text update
    const statuses = ['Inicializando...', 'Preparando experiência...', 'Pronto.'];
    statuses.forEach((text, i) => {
      tl.call(() => { if (status) status.textContent = text; }, [], i * 0.5);
    });

    return () => { tl.kill(); };
  }, []);

  if (completed) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      style={{ background: '#0A0F0D' }}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Leaf icon */}
        <svg
          ref={leafRef}
          viewBox="0 0 100 100"
          className="w-20 h-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="preloader-leaf"
            d="M50 5 C20 5, 5 30, 5 55 C5 80, 25 95, 50 95 C75 95, 95 75, 95 50 C95 25, 75 5, 50 5Z"
            fill="none"
            stroke="#98A99A"
            strokeWidth="1.5"
          />
          <g stroke="#4ADE80" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.7">
            <path className="preloader-vein" d="M50 20 L50 80" />
            <path className="preloader-vein" d="M50 35 L30 50" />
            <path className="preloader-vein" d="M50 35 L70 48" />
            <path className="preloader-vein" d="M50 50 L25 65" />
            <path className="preloader-vein" d="M50 50 L72 63" />
            <path className="preloader-vein" d="M50 65 L35 78" />
            <path className="preloader-vein" d="M50 65 L68 76" />
          </g>
        </svg>

        {/* Brand name */}
        <span
          className="text-white font-bold"
          style={{ fontSize: '1.5rem', letterSpacing: '0.3em' }}
        >
          ROOT CODE
        </span>

        {/* Progress bar */}
        <div
          className="w-48 h-[2px] rounded-full overflow-hidden"
          style={{ background: 'rgba(255, 255, 255, 0.1)' }}
        >
          <div
            ref={barRef}
            className="h-full rounded-full"
            style={{
              width: '0%',
              background: 'linear-gradient(90deg, #4ADE80, #98A99A)',
            }}
          />
        </div>

        {/* Status */}
        <div
          ref={statusRef}
          className="text-white/40 text-xs"
          style={{ letterSpacing: '0.1em' }}
        >
          Inicializando...
        </div>
      </div>
    </div>
  );
}
