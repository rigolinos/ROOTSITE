'use client';

import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap-register';
import { MOTION } from '@/lib/animations';

/**
 * Animated SVG Leaf Logo
 * Brand leaf shape with stroke-draw, fill fade, and vein growth animation.
 */
export default function LeafSVG() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const leafPath = svg.querySelector('.leaf-outline') as SVGPathElement;
    const leafFill = svg.querySelector('.leaf-fill') as SVGPathElement;
    const veins = svg.querySelectorAll('.leaf-vein');
    const glowPath = svg.querySelector('.leaf-glow') as SVGPathElement;

    if (!leafPath) return;

    // Get total length for stroke-dashoffset animation
    const pathLength = leafPath.getTotalLength();

    // Initial states
    gsap.set(leafPath, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
      opacity: 1,
    });
    gsap.set(leafFill, { opacity: 0 });
    gsap.set(veins, { strokeDasharray: 80, strokeDashoffset: 80, opacity: 0 });
    gsap.set(glowPath, { opacity: 0 });

    // Master timeline — starts after hero text (delay 800ms)
    const tl = gsap.timeline({ delay: 0.8 });

    // 1. Outline draws
    tl.to(leafPath, {
      strokeDashoffset: 0,
      duration: MOTION.duration.hero,
      ease: MOTION.ease.reveal,
    });

    // 2. Fill fades in
    tl.to(leafFill, {
      opacity: 0.85,
      duration: MOTION.duration.default,
      ease: MOTION.ease.fade,
    }, '-=0.8');

    // 3. Veins draw one by one
    tl.to(veins, {
      strokeDashoffset: 0,
      opacity: 1,
      duration: MOTION.duration.min,
      stagger: MOTION.stagger.lines,
      ease: MOTION.ease.slide,
    }, '-=0.6');

    // 4. Subtle glow pulse (infinite)
    tl.to(glowPath, {
      opacity: 0.15,
      duration: MOTION.duration.default,
      ease: MOTION.ease.fade,
      onComplete: () => {
        gsap.to(glowPath, {
          opacity: 0.08,
          duration: 3,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      },
    }, '-=0.4');

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 mb-6"
      aria-label="Root Code Logo"
    >
      {/* Glow layer */}
      <path
        className="leaf-glow"
        d="M50 5 C20 5, 5 30, 5 55 C5 80, 25 95, 50 95 C75 95, 95 75, 95 50 C95 25, 75 5, 50 5Z"
        fill="none"
        stroke="#4ADE80"
        strokeWidth="4"
        filter="url(#leafGlow)"
        opacity="0"
      />

      {/* Fill */}
      <path
        className="leaf-fill"
        d="M50 5 C20 5, 5 30, 5 55 C5 80, 25 95, 50 95 C75 95, 95 75, 95 50 C95 25, 75 5, 50 5Z"
        fill="#1B3022"
        opacity="0"
      />

      {/* Outline */}
      <path
        className="leaf-outline"
        d="M50 5 C20 5, 5 30, 5 55 C5 80, 25 95, 50 95 C75 95, 95 75, 95 50 C95 25, 75 5, 50 5Z"
        fill="none"
        stroke="#98A99A"
        strokeWidth="1.5"
        opacity="0"
      />

      {/* Veins */}
      <g stroke="#4ADE80" strokeWidth="1.2" fill="none" strokeLinecap="round">
        <path className="leaf-vein" d="M50 20 L50 80" />
        <path className="leaf-vein" d="M50 35 L30 50" />
        <path className="leaf-vein" d="M50 35 L70 48" />
        <path className="leaf-vein" d="M50 50 L25 65" />
        <path className="leaf-vein" d="M50 50 L72 63" />
        <path className="leaf-vein" d="M50 65 L35 78" />
        <path className="leaf-vein" d="M50 65 L68 76" />
      </g>

      {/* SVG Filter for glow */}
      <defs>
        <filter id="leafGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
        </filter>
      </defs>
    </svg>
  );
}
