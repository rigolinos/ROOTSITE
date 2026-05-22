'use client';

import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap-register';
import { MOTION } from '@/lib/animations';

/**
 * Cinematic Hero Typography
 * Split text reveal with character stagger + clip-path animation.
 * 
 * Hierarchy:  Title → Tagline → Subtitle (sequential, deliberate)
 */
export default function HeroTypography() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const charSpans = container.querySelectorAll('.char');
    const tagline = taglineRef.current;
    const subtitle = subtitleRef.current;

    // Set initial states
    gsap.set(charSpans, { y: '110%', scale: 0.95, opacity: 0 });
    gsap.set(tagline, { y: 30, opacity: 0, filter: 'blur(10px)' });
    gsap.set(subtitle, { y: 20, opacity: 0, filter: 'blur(8px)' });

    // Master timeline
    const tl = gsap.timeline({ delay: 0.3 });

    // 1. Title characters reveal
    tl.to(charSpans, {
      y: '0%',
      scale: 1,
      opacity: 1,
      duration: MOTION.duration.hero,
      stagger: MOTION.stagger.chars,
      ease: MOTION.ease.reveal,
    });

    // 2. Tagline fades in (after title stabilizes)
    tl.to(tagline, {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: MOTION.duration.default,
      ease: MOTION.ease.fade,
    }, `-=${MOTION.delay.afterHero}`);

    // 3. Subtitle fades in
    tl.to(subtitle, {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: MOTION.duration.min,
      ease: MOTION.ease.fade,
    }, `-=${MOTION.delay.secondary}`);

    return () => {
      tl.kill();
    };
  }, []);

  // Split "ROOT CODE" into individual characters
  const title = 'ROOT CODE';
  const chars = title.split('');

  return (
    <div ref={containerRef} className="text-center">
      {/* Title */}
      <h1
        ref={titleRef}
        className="text-glow mb-4"
        style={{
          fontSize: 'clamp(3rem, 8vw, 7rem)',
          fontWeight: 800,
          letterSpacing: '0.15em',
          lineHeight: 1,
        }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            className="inline-block overflow-hidden"
            style={{ verticalAlign: 'top' }}
          >
            <span
              className="char inline-block will-change-transform"
              style={{ display: 'inline-block' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          </span>
        ))}
      </h1>

      {/* Tagline */}
      <p
        ref={taglineRef}
        className="will-change-transform mb-6"
        style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
          fontWeight: 300,
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: '#98A99A',
        }}
      >
        Eficiência Silenciosa
      </p>

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        className="will-change-transform max-w-xl mx-auto"
        style={{
          fontSize: 'clamp(0.85rem, 1.5vw, 1.1rem)',
          fontWeight: 400,
          lineHeight: 1.8,
          color: 'rgba(255, 255, 255, 0.6)',
        }}
      >
        Cultivando ecossistemas digitais onde a complexidade
        <br />
        técnica floresce em simplicidade arquitetônica.
      </p>
    </div>
  );
}
