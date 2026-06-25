'use client';

import { useRef, useState } from 'react';
import { gsap, SplitText } from '@/lib/gsap-register';
import { useGSAP } from '@gsap/react';
import { MOTION } from '@/lib/animations';
import TextScramble from '@/components/effects/TextScramble';

export default function HeroTypography() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  
  const [showTagline, setShowTagline] = useState(false);

  useGSAP(() => {
    if (!titleRef.current) return;
    
    const split = new SplitText(titleRef.current, { type: 'chars' });
    const chars = split.chars;
    
    gsap.set(chars, { y: '110%', scale: 0.95, opacity: 0 });
    gsap.set(taglineRef.current, { opacity: 0, filter: 'blur(10px)' });
    gsap.set(subtitleRef.current, { y: 20, opacity: 0, filter: 'blur(8px)' });

    const tl = gsap.timeline({ delay: 0.3 });

    tl.to(chars, {
      y: '0%',
      scale: 1,
      opacity: 1,
      duration: MOTION.duration.hero,
      stagger: MOTION.stagger.chars,
      ease: MOTION.ease.reveal,
    });

    tl.to(taglineRef.current, {
      opacity: 1,
      filter: 'blur(0px)',
      duration: MOTION.duration.default,
      ease: MOTION.ease.fade,
      onStart: () => setShowTagline(true),
    }, `-=${MOTION.delay.afterHero}`);

    tl.to(subtitleRef.current, {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: MOTION.duration.min,
      ease: MOTION.ease.fade,
    }, `-=${MOTION.delay.secondary}`);

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="text-center w-full flex flex-col items-center justify-start pt-[20vh] md:pt-[25vh] h-full">
      <h1
        ref={titleRef}
        className="text-glow mb-4"
        style={{
          fontSize: 'clamp(3rem, 8vw, 7rem)',
          fontWeight: 800,
          letterSpacing: '0.15em',
          paddingLeft: '0.15em', // optical centering fix
          lineHeight: 1,
        }}
      >
        ROOT CODE
      </h1>

      <p
        ref={taglineRef}
        className="will-change-transform mb-6"
        style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
          fontWeight: 300,
          letterSpacing: '0.4em',
          paddingLeft: '0.4em', // optical centering fix
          textTransform: 'uppercase',
          color: '#98A99A',
        }}
      >
        {showTagline ? <TextScramble text="Eficiência Silenciosa" /> : 'Eficiência Silenciosa'}
      </p>

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
