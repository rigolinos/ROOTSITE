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
    <div ref={containerRef} className="text-center w-full max-w-[1000px] flex flex-col items-center justify-start h-full px-4" style={{ paddingTop: '18vh' }}>
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/10 mb-4 md:mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(74,222,128,0.1)]">
        <span className="w-2 h-2 rounded-full bg-glow animate-pulse" />
        <span className="text-[10px] md:text-xs font-semibold tracking-[0.25em] text-white/90 uppercase">Estúdio de Engenharia Digital Premium</span>
      </div>

      <h1
        ref={titleRef}
        className="text-glow mb-3 md:mb-4 select-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
        style={{
          fontSize: 'clamp(2.8rem, 8.5vw, 6.5rem)',
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
        className="will-change-transform mb-6 md:mb-8 text-glow select-none drop-shadow-[0_2px_15px_rgba(74,222,128,0.4)]"
        style={{
          fontSize: 'clamp(1.1rem, 2.8vw, 1.75rem)',
          fontWeight: 400,
          letterSpacing: '0.3em',
          paddingLeft: '0.3em',
          textTransform: 'uppercase',
          color: '#4ADE80',
        }}
      >
        {showTagline ? <TextScramble text="Eficiência Silenciosa" /> : 'Eficiência Silenciosa'}
      </p>

      <div
        ref={subtitleRef}
        className="will-change-transform max-w-2xl mx-auto flex flex-col items-center"
      >
        <p
          className="text-white/85 font-light leading-relaxed tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] text-sm md:text-lg mb-8 px-2"
        >
          Transformamos a complexidade do seu negócio em plataformas digitais de alta conversão, ultrarrápidas e desenhadas para impressionar clientes premium.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-[400px] sm:max-w-none px-4 sm:px-0">
          <a
            href="https://wa.me/5511999999999?text=Olá!%20Gostaria%20de%20solicitar%20um%20diagnóstico%20digital%20com%20a%20Root%20Code."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#1B3022] hover:bg-[#23402C] text-white font-semibold text-xs md:text-sm tracking-widest uppercase transition-all duration-300 border border-[#4ADE80]/40 shadow-[0_0_30px_rgba(74,222,128,0.3)] hover:shadow-[0_0_45px_rgba(74,222,128,0.5)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-4 h-4 text-glow shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.2-.52.2-.67-.15-.867-.742-1.18-1.042-.313-.299-.67-.348-1.016-.2-.347.149-1.229.742-2.316 1.701-1.378 1.218-2.302 2.709-2.574 3.18-.273.471-.029.724.22.973.222.222.495.57.742.857.247.286.331.482.495.779.165.297.083.558-.041.808-.124.25-1.106 2.666-1.515 3.652-.395.952-.796.822-1.092.838-.272.015-.584.015-.896.015-.313 0-.82-.119-1.249-.586-.43-.467-1.644-1.606-1.644-3.918 0-2.312 1.685-4.548 1.919-4.858.235-.31 3.316-5.064 8.035-7.104 1.124-.486 2.001-.777 2.684-.993.684-.216 1.468-.186 2.021-.112.62.083 1.905.779 2.173 1.534.268.755.268 1.401.188 1.534-.08.133-.297.216-.62.365z M12 2C6.48 2 2 6.48 2 12c0 2.17.69 4.18 1.86 5.82L3 21l3.29-.86C7.8 21.32 9.83 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
            </svg>
            <span>Solicitar Diagnóstico</span>
          </a>
        </div>
      </div>
    </div>
  );
}
