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
    <div ref={containerRef} className="relative z-10 w-full min-h-screen flex flex-col justify-between items-center px-4 pt-24 pb-12">
      {/* BLOCO DE TEXTO SUPERIOR */}
      <div className="flex flex-col items-center mt-4 md:mt-12 w-full">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/10 mb-3 md:mb-5 backdrop-blur-md shadow-[0_0_20px_rgba(74,222,128,0.1)]">
          <span className="w-2 h-2 rounded-full bg-glow animate-pulse" />
          <span className="text-[10px] md:text-xs font-semibold tracking-[0.25em] text-white/90 uppercase">Estúdio de Engenharia Digital Premium</span>
        </div>

        <h1
          ref={titleRef}
          className="text-glow mb-2 md:mb-3 select-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
          style={{
            fontSize: 'clamp(2.6rem, 7.5vw, 6rem)',
            fontWeight: 800,
            letterSpacing: '0.12em',
            paddingLeft: '0.12em',
            lineHeight: 1.05,
          }}
        >
          ROOT CODE
        </h1>

        <p
          ref={taglineRef}
          className="will-change-transform mb-5 md:mb-7 text-glow select-none drop-shadow-[0_2px_15px_rgba(74,222,128,0.4)]"
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.6rem)',
            fontWeight: 400,
            letterSpacing: '0.25em',
            paddingLeft: '0.25em',
            textTransform: 'uppercase',
            color: '#34d399',
          }}
        >
          {showTagline ? <TextScramble text="Eficiência Silenciosa" /> : 'Eficiência Silenciosa'}
        </p>

        <div
          ref={subtitleRef}
          className="will-change-transform w-full flex flex-col items-center"
        >
          <p
            className="text-zinc-400 font-light leading-relaxed tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] text-xs md:text-base max-w-[320px] md:max-w-lg text-center"
          >
            Transformamos a complexidade do seu negócio em plataformas digitais de alta conversão, ultrarrápidas e desenhadas para impressionar clientes premium.
          </p>
        </div>
      </div>

      {/* ANCORA BASE - SCROLL INDICATOR */}
      <div className="flex flex-col items-center opacity-70">
        <span className="text-[10px] tracking-[0.3em] text-white/70 uppercase mb-2">Scroll</span>
        <div className="w-[1px] h-6 bg-glow animate-pulse"></div>
      </div>
    </div>
  );
}
