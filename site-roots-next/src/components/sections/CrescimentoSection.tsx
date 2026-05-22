'use client';

import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-register';
import { MOTION } from '@/lib/animations';

/**
 * Crescimento Section — "Seu projeto ganha vida."
 * Reveal with parallax depth effect.
 */
export default function CrescimentoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Title reveal
      gsap.fromTo(
        titleRef.current,
        { y: 60, opacity: 0, filter: 'blur(8px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: MOTION.duration.default,
          ease: MOTION.ease.slide,
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            end: 'top 35%',
            scrub: MOTION.scrub.smooth,
          },
        }
      );

      // Subtitle reveal (after title)
      gsap.fromTo(
        subtitleRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: MOTION.duration.default,
          ease: MOTION.ease.fade,
          scrollTrigger: {
            trigger: section,
            start: 'top 65%',
            end: 'top 30%',
            scrub: MOTION.scrub.smooth,
          },
        }
      );

      // Background orb parallax
      gsap.fromTo(
        orbRef.current,
        { y: 200, scale: 0.6, opacity: 0 },
        {
          y: -100,
          scale: 1.3,
          opacity: 0.08,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: MOTION.scrub.cinematic,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full flex items-center justify-center overflow-hidden py-32 md:py-48"
      style={{ minHeight: '80dvh' }}
    >
      {/* Background orb */}
      <div
        ref={orbRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(74, 222, 128, 0.06) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 text-center max-w-3xl px-6">
        <h2
          ref={titleRef}
          className="text-white mb-6 opacity-0"
          style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          Seu projeto
          <br />
          ganha vida.
        </h2>
        <p
          ref={subtitleRef}
          className="max-w-lg mx-auto opacity-0"
          style={{
            fontSize: 'clamp(0.9rem, 1.5vw, 1.15rem)',
            fontWeight: 400,
            lineHeight: 1.8,
            color: 'rgba(255, 255, 255, 0.6)',
          }}
        >
          Do primeiro pixel ao ecossistema completo — acompanhamos cada fase do
          crescimento digital do seu negócio.
        </p>
      </div>
    </section>
  );
}
