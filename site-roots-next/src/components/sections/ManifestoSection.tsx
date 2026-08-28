'use client';

import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap-register';
import { MOTION } from '@/lib/animations';

interface ManifestoSectionProps {
  isActive: boolean;
}

export default function ManifestoSection({ isActive }: ManifestoSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const hLineLeft = useRef<HTMLDivElement>(null);
  const hLineRight = useRef<HTMLDivElement>(null);
  const vLineTop = useRef<HTMLDivElement>(null);
  const vLineBottom = useRef<HTMLDivElement>(null);

  const numRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleMouseEnter = (index: number) => {
    // 0: TL, 1: TR, 2: BL, 3: BR
    
    // Highlight lines
    const linesToHighlight = [];
    if (index === 0) linesToHighlight.push(hLineLeft.current, vLineTop.current);
    if (index === 1) linesToHighlight.push(hLineRight.current, vLineTop.current);
    if (index === 2) linesToHighlight.push(hLineLeft.current, vLineBottom.current);
    if (index === 3) linesToHighlight.push(hLineRight.current, vLineBottom.current);

    gsap.to(linesToHighlight, { backgroundColor: '#4ADE80', duration: 0.3, boxShadow: '0 0 15px rgba(74,222,128,0.4)' });

    // Number glitch/jump
    const numEl = numRefs.current[index];
    if (numEl) {
      gsap.fromTo(numEl, 
        { y: -10, opacity: 0.5 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: 'elastic.out(1, 0.3)' }
      );
    }
    
    // Event Bridge - Dispatch active quadrant
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('root-hover', { detail: { segmentId: `quadrant-${index}` } }));
    }
  };

  const handleMouseLeave = (index: number) => {
    const linesToHighlight = [];
    if (index === 0) linesToHighlight.push(hLineLeft.current, vLineTop.current);
    if (index === 1) linesToHighlight.push(hLineRight.current, vLineTop.current);
    if (index === 2) linesToHighlight.push(hLineLeft.current, vLineBottom.current);
    if (index === 3) linesToHighlight.push(hLineRight.current, vLineBottom.current);

    gsap.to(linesToHighlight, { backgroundColor: 'rgba(255,255,255,0.07)', duration: 0.6, boxShadow: 'none' });
  };

  const cards = [
    { num: '01', title: 'Site no Ar em até 48 Horas*', desc: 'Agilidade máxima para lançar sua plataforma e começar a captar clientes sem semanas de espera.' },
    { num: '02', title: 'Projetos a partir de R$ 850', desc: 'Engenharia digital de alto padrão e visual premium com investimento acessível e transparente.' },
    { num: '03', title: 'Projetos 100% Personalizados', desc: 'Arquitetura exclusiva desenhada para a sua marca. Recusamos temas prontos e templates genéricos.' },
    { num: '04', title: 'Infraestrutura Completa', desc: 'Hospedagem ultrarrápida, domínio, segurança blindada e suporte contínuo inclusos.' },
  ];

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      const texts = textRefs.current.filter(Boolean);
      const lines = [hLineLeft.current, hLineRight.current, vLineTop.current, vLineBottom.current].filter(Boolean);

      if (isActive) {
        gsap.set('.section-title', { opacity: 0, y: 30 });
        gsap.set(texts, { opacity: 0, x: -30 });
        gsap.set(lines, { scale: 0 }); // Will scale from origin (center)

        const tl = gsap.timeline({ delay: 0.1 });

        tl.to('.section-title', { opacity: 1, y: 0, duration: 0.8, ease: MOTION.ease.reveal });
        
        // Lines draw from center
        tl.to(lines, {
          scale: 1,
          duration: 1.2,
          ease: 'power3.out'
        }, '-=0.4');

        // Texts enter in cascade
        tl.to(texts, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: MOTION.ease.reveal
        }, '-=0.8');

      } else {
        gsap.to(containerRef.current, { opacity: 0, duration: 0.4 });
      }
    }, containerRef);
    
    if (isActive) {
      gsap.to(containerRef.current, { opacity: 1, duration: 0.4 });
    }
    return () => ctx.revert();
  }, [isActive]);

  return (
    <div className="section-content w-full h-full relative max-w-[1200px] mx-auto flex flex-col justify-center px-4 md:px-8" ref={containerRef} style={{ opacity: 0 }}>
      {/* Structural Grid Lines (Visible on Desktop) */}
      <div className="absolute inset-0 pointer-events-none z-0 hidden md:flex">
        {/* Horizontal Left */}
        <div ref={hLineLeft} className="absolute top-1/2 left-0 w-1/2 h-[1px] bg-white/[0.07] origin-right" />
        {/* Horizontal Right */}
        <div ref={hLineRight} className="absolute top-1/2 right-0 w-1/2 h-[1px] bg-white/[0.07] origin-left" />
        {/* Vertical Top */}
        <div ref={vLineTop} className="absolute top-0 left-1/2 w-[1px] h-1/2 bg-white/[0.07] origin-bottom" />
        {/* Vertical Bottom */}
        <div ref={vLineBottom} className="absolute bottom-0 left-1/2 w-[1px] h-1/2 bg-white/[0.07] origin-top" />
      </div>

      {/* Title Block */}
      <h2 className="section-title w-full max-w-3xl mx-auto text-center flex flex-col items-center mb-10 md:mb-0 md:absolute md:top-[12vh] md:left-1/2 md:-translate-x-1/2 uppercase relative z-20">
        <span className="text-glow tracking-[0.25em] font-semibold text-xs md:text-sm block mb-3 text-center">Diferencial Competitivo</span>
        <span className="text-white font-light tracking-wide text-xl md:text-3xl normal-case block w-full text-center leading-snug">
          Construímos ecossistemas digitais para empresas que recusam o genérico.
        </span>
      </h2>
      
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-4xl mx-auto relative z-10 gap-y-6 md:gap-x-12 md:gap-y-12 items-stretch justify-items-stretch md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
        {cards.map((card, i) => (
          <div
            key={i}
            className="manifesto-quadrant h-full min-h-[140px] flex flex-col justify-center p-6 rounded-xl bg-black/40 backdrop-blur-sm border border-emerald-500/20 relative group transition-all duration-300 hover:bg-black/50 hover:border-emerald-500/40"
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={() => handleMouseLeave(i)}
          >
            <div ref={(el) => { textRefs.current[i] = el; }} className="flex flex-col items-center text-center w-full">
              <div 
                ref={(el) => { numRefs.current[i] = el; }}
                className="text-emerald-400 font-mono text-xs mb-1 font-semibold tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] inline-block"
              >
                {card.num} //
              </div>
              <h3 className="text-base md:text-lg font-bold text-white mb-1.5 tracking-wide group-hover:text-glow transition-colors duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{card.title}</h3>
              <p className="text-xs md:text-sm text-stone-300 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
