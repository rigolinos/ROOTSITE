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
    { num: '01', title: 'Entendimento do Seu Negócio', desc: 'Não iniciamos o design sem entender seu público, suas metas e quem é seu cliente ideal.' },
    { num: '02', title: 'Carregamento Instantâneo', desc: 'Cada segundo de demora custa vendas. Nossos sites carregam em menos de 1 segundo em qualquer celular.' },
    { num: '03', title: 'Design 100% Exclusivo', desc: 'Zero templates prontos. Sua empresa recebe uma identidade digital única e impossível de ser copiada.' },
    { num: '04', title: 'Parceria Contínua', desc: 'Você nunca fica na mão. Garantimos seu site sempre no ar, seguro, atualizado e evoluindo.' },
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
    <div className="section-content w-full relative max-w-[1200px] mx-auto min-h-[600px] flex flex-col justify-center" ref={containerRef} style={{ opacity: 0 }}>
      <h2 className="section-title text-center mb-16 uppercase relative z-20">
        <span className="text-glow tracking-widest text-sm md:text-base block mb-2">Por que a Root Code?</span>
        <span className="text-white/80 font-light tracking-wide text-lg md:text-2xl normal-case">Construímos sites para marcas que recusam o genérico.</span>
      </h2>
      
      {/* Structural Grid Lines (Visible on Desktop) */}
      <div className="absolute inset-0 top-[100px] bottom-0 pointer-events-none z-0 hidden md:flex">
        {/* Horizontal Left */}
        <div ref={hLineLeft} className="absolute top-1/2 left-0 w-1/2 h-[1px] bg-white/[0.07] origin-right" />
        {/* Horizontal Right */}
        <div ref={hLineRight} className="absolute top-1/2 right-0 w-1/2 h-[1px] bg-white/[0.07] origin-left" />
        {/* Vertical Top */}
        <div ref={vLineTop} className="absolute top-0 left-1/2 w-[1px] h-1/2 bg-white/[0.07] origin-bottom" />
        {/* Vertical Bottom */}
        <div ref={vLineBottom} className="absolute bottom-0 left-1/2 w-[1px] h-1/2 bg-white/[0.07] origin-top" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 w-full relative z-10 h-full">
        {cards.map((card, i) => (
          <div
            key={i}
            className="manifesto-quadrant p-10 md:p-16 flex flex-col justify-center relative group"
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={() => handleMouseLeave(i)}
          >
            <div ref={(el) => { textRefs.current[i] = el; }}>
              <div 
                ref={(el) => { numRefs.current[i] = el; }}
                className="text-white/20 font-mono text-sm mb-6 tracking-widest group-hover:text-glow transition-colors duration-300 inline-block"
              >
                {card.num} //
              </div>
              <h3 className="text-xl md:text-2xl font-light text-white mb-4 tracking-wide group-hover:text-glow transition-colors duration-500">{card.title}</h3>
              <p className="text-sm md:text-base text-white/40 leading-relaxed font-light group-hover:text-white/80 transition-colors duration-500">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
