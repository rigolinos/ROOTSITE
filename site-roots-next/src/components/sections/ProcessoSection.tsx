'use client';

import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap-register';
import { MOTION } from '@/lib/animations';

interface ProcessoSectionProps {
  isActive: boolean;
}

export default function ProcessoSection({ isActive }: ProcessoSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const steps = [
    { num: '01', title: 'DESCOBERTA', desc: 'Imersão profunda no ecossistema e nas metas vitais do seu negócio.' },
    { num: '02', title: 'ARQUITETURA', desc: 'Topologia técnica de ponta e wireframes baseados em alta conversão.' },
    { num: '03', title: 'ENGENHARIA', desc: 'Desenvolvimento ágil com código limpo, escalável e iterativo.' },
    { num: '04', title: 'DEPLOYMENT', desc: 'Lançamento otimizado com extrema performance (Lighthouse 95+).' },
  ];

  // Magnetic hover effect for the balloons
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    gsap.to(el, {
      x: x * 0.4,
      y: y * 0.4,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.3)',
    });
  };

  useEffect(() => {
    if (!containerRef.current || !lineRef.current) return;

    const ctx = gsap.context(() => {
      const stepCircles = gsap.utils.toArray<HTMLElement>('.process-circle');
      const stepTexts = gsap.utils.toArray<HTMLElement>('.process-text');

      if (isActive) {
        // Reset states for enter animation
        gsap.set(lineRef.current, { scaleX: 0, transformOrigin: 'center center' });
        gsap.set(stepCircles, { scale: 0, opacity: 0 });
        gsap.set(stepTexts, { y: 40, opacity: 0 });

        const tl = gsap.timeline({ delay: 0.1 });

        // 1. Line tracing from center (tree trunk) outwards
        tl.to(lineRef.current, {
          scaleX: 1,
          duration: 1.5,
          ease: 'power3.inOut',
        });

        // 2. Balloons (nodes) pop in while line is drawing
        tl.to(stepCircles, {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'back.out(1.5)',
        }, '-=1.0');

        // Continuous organic oscillation for the gooey effect
        stepCircles.forEach((circle, i) => {
          gsap.to(circle.querySelectorAll('.gooey-blob'), {
            x: 'random(-15, 15)',
            y: 'random(-15, 15)',
            scale: 'random(0.8, 1.2)',
            duration: 'random(2, 4)',
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: i * 0.2
          });
        });

        // 3. Text content reveals beautifully
        tl.to(stepTexts, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: MOTION.ease.reveal,
        }, '-=0.8');
      } else {
        // Erase the line towards the center when scrolling away
        gsap.to(lineRef.current, {
          scaleX: 0,
          transformOrigin: 'center center',
          duration: 0.6,
          ease: 'power2.inOut'
        });
        
        gsap.to(stepCircles, { scale: 0, opacity: 0, duration: 0.4, stagger: 0.05 });
        gsap.to(stepTexts, { opacity: 0, y: -20, duration: 0.4 });
        gsap.to(containerRef.current, { opacity: 0, duration: 0.6, delay: 0.2 });
      }
    }, containerRef);

    if (isActive) {
      gsap.to(containerRef.current, { opacity: 1, duration: 0.4 });
    }

    return () => ctx.revert();
  }, [isActive]);

  return (
    <div className="section-content w-full max-w-[1400px] px-4 md:px-12" ref={containerRef} style={{ opacity: 0 }}>
      {/* Global Gooey Filter Definition */}
      <svg className="hidden">
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="gooey" />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

      <h2 className="section-title text-glow mb-12 md:mb-40 text-center tracking-[0.3em] uppercase text-xl md:text-3xl font-light">
        A Jornada
      </h2>
      
      <div className="relative w-full">
        {/* Background Subtle Line */}
        <div className="absolute top-[48px] md:top-[64px] left-[5%] right-[5%] h-[1px] bg-white/5 hidden md:block" />
        
        {/* Animated Tracing Line - Origin Center to simulate tree branching */}
        <div 
          ref={lineRef}
          className="absolute top-[48px] md:top-[64px] left-[5%] right-[5%] h-[2px] bg-glow shadow-[0_0_20px_rgba(74,222,128,0.8),0_0_40px_rgba(74,222,128,0.4)] hidden md:block origin-center" 
        />

        <div className="flex flex-col md:flex-row justify-between relative z-10 gap-8 md:gap-4 px-[5%]">
          {steps.map((step, i) => (
            <div key={i} className="process-step flex-1 flex flex-col md:items-center text-left md:text-center group">
              
              {/* Premium Balloon - Liquid/Gooey */}
              <div 
                className="process-circle w-16 h-16 md:w-32 md:h-32 mb-6 md:mb-12 relative cursor-crosshair group"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ filter: 'url(#gooey)' }}
              >
                {/* Main Body */}
                <div className="absolute inset-0 bg-[#1B3022] rounded-full flex items-center justify-center transition-all duration-700 group-hover:scale-110 shadow-[0_10px_30px_rgba(0,0,0,0.8)] group-hover:shadow-[0_0_50px_rgba(74,222,128,0.2)] z-10 border border-[#98A99A]/20">
                  <span className="text-white font-black text-xl md:text-4xl relative z-20 transition-all duration-500 group-hover:text-glow group-hover:scale-125 group-hover:drop-shadow-[0_0_15px_rgba(74,222,128,0.6)]">{step.num}</span>
                  {/* Inner Glow */}
                  <div className="absolute inset-0 rounded-full bg-glow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                </div>
                
                {/* Orbiting Blobs for Liquid Morphing */}
                <div className="gooey-blob absolute top-0 left-0 w-full h-full bg-[#1B3022] rounded-full" />
                <div className="gooey-blob absolute -top-2 -left-2 w-full h-full bg-[#1B3022] rounded-full scale-90" />
                <div className="gooey-blob absolute top-2 left-2 w-full h-full bg-[#1B3022] rounded-full scale-95" />
              </div>
              
              {/* Premium Text */}
              <div className="process-text">
                <h3 className="text-xl md:text-2xl font-light text-white mb-4 tracking-[0.2em] group-hover:text-glow transition-colors duration-500">
                  {step.title}
                </h3>
                <p className="text-sm md:text-base text-white/50 leading-relaxed max-w-[280px] line-clamp-2 md:line-clamp-none mx-auto font-light group-hover:text-white/80 transition-colors duration-500">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
