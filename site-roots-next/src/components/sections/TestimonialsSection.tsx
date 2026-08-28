'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap-register';
import { MOTION } from '@/lib/animations';

interface TestimonialsSectionProps {
  isActive: boolean;
}

export default function TestimonialsSection({ isActive }: TestimonialsSectionProps) {
  const testimonials = [
    {
      name: 'Luiza B.',
      role: 'Head of Growth',
      text: 'Surreal o nível de detalhe e carinho que eles colocam no código. Nosso novo portal carrega instantaneamente no mobile.',
      initials: 'LB'
    },
    {
      name: 'Equipe Riff Sports',
      role: 'Founders',
      text: 'Queríamos algo que transmitisse energia e profissionalismo. O resultado superou as expectativas — nossos clientes elogiam o site constantemente.',
      initials: 'RS'
    },
    {
      name: 'Marcos T.',
      role: 'Diretor de Marketing',
      text: 'A entrega em 48h salvou o nosso lançamento comercial. Arquitetura impecável e suporte em tempo real.',
      initials: 'MT'
    }
  ];

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      if (isActive) {
        gsap.fromTo(
          containerRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: MOTION.ease.reveal }
        );
      } else {
        gsap.to(containerRef.current, { opacity: 0, duration: 0.4 });
      }
    }, containerRef);
    return () => ctx.revert();
  }, [isActive]);

  return (
    <div className="relative z-10 w-full min-h-screen flex flex-col justify-center items-center px-4 md:px-8 py-16 opacity-0" ref={containerRef}>
      <div className="w-full max-w-3xl mx-auto text-center flex flex-col items-center mb-12 relative z-20">
        <span className="text-emerald-400 font-mono text-xs tracking-[0.25em] uppercase font-semibold mb-3">
          PESSOAS & RESULTADOS
        </span>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
          A confiança de líderes corporativos e empreendedores exigentes.
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
        {testimonials.map((test, index) => (
          <div 
            key={index} 
            className="bg-[#080d0a]/80 border border-white/[0.08] hover:border-emerald-500/30 rounded-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(16,185,129,0.08)]"
            style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '220px', position: 'relative' }}
          >
            <div className="w-full relative z-10">
              <div className="flex items-center justify-between mb-4 w-full">
                <span className="text-emerald-400 text-2xl font-serif leading-none">“</span>
                <span className="text-emerald-400 text-xs tracking-widest">★★★★★</span>
              </div>
              <p className="text-xs md:text-sm text-stone-200 leading-relaxed mb-6">
                {test.text}
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-white/[0.04] w-full relative z-10">
              <div className="w-8 h-8 rounded-full bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold text-emerald-400 font-mono shrink-0">
                {test.initials}
              </div>
              <div className="flex flex-col text-left">
                <h4 className="text-xs font-bold text-white leading-none mb-1">{test.name}</h4>
                <p className="text-[10px] text-stone-400 font-sans leading-none">{test.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
