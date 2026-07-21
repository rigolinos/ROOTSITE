'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap-register';
import { MOTION } from '@/lib/animations';

interface TestimonialsSectionProps {
  isActive: boolean;
}

export default function TestimonialsSection({ isActive }: TestimonialsSectionProps) {
  const testimonials = [
    { name: 'Rodrigo Rigo', role: 'CEO & Estrategista de IA', text: 'Eles entenderam o que eu queria antes de eu terminar de explicar. O site ficou mais profissional do que eu imaginava, e tudo foi entregue antes do prazo.', initials: 'RR', logo: '/projects/deep-rules.png' },
    { name: 'Equipe Riff Sports', role: 'Founders', text: 'Queríamos algo que transmitisse energia e profissionalismo. O resultado superou as expectativas — nossos clientes elogiam o site constantemente.', initials: 'RS', logo: '/projects/riff-sports.png' },
    { name: 'Amanda S.', role: 'Veterinária — PetConnect', text: 'Eu não entendia nada de tecnologia, mas eles me guiaram em cada etapa. Hoje tenho um sistema que funciona sozinho e meus clientes adoram.', initials: 'AS', logo: '/projects/petconnect.png' },
    { name: 'Marcos T.', role: 'Diretor de Marketing', text: 'A entrega foi impecável e a performance do site mudou nosso jogo de conversão de leads. A melhor decisão técnica que tomamos este ano.', initials: 'MT', logo: null },
    { name: 'Luiza B.', role: 'Head of Growth', text: 'Surreal o nível de detalhe e carinho que eles colocam no código. Nosso novo portal carrega instantaneamente no mobile.', initials: 'LB', logo: null },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToTestimonial = (index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const width = container.clientWidth;
    container.scrollTo({
      left: width * index,
      behavior: 'smooth'
    });
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const width = container.clientWidth;
    const newIndex = Math.round(scrollLeft / width);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('testimonial-active', { detail: { index: currentIndex } }));
    }
  }, [currentIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % testimonials.length;
      scrollToTestimonial(nextIndex);
    }, 8000);
    return () => clearInterval(timer);
  }, [currentIndex, testimonials.length]);

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
    <div className="section-content w-full max-w-[900px] px-4 md:px-8" ref={containerRef} style={{ opacity: 0 }}>
      <h2 
        className="section-title text-center mb-8 md:mb-16 relative z-20"
      >
        <span className="text-glow tracking-[0.25em] font-semibold text-xs md:text-sm block mb-3 uppercase">Pessoas & Resultados</span>
        <span className="text-white font-light tracking-wide text-xl md:text-3xl normal-case block max-w-2xl mx-auto leading-snug">
          A confiança de líderes corporativos e empreendedores exigentes.
        </span>
      </h2>
      
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="testimonial-container mx-auto mt-4 md:mt-10 flex overflow-x-auto snap-x snap-mandatory hide-scrollbar touch-pan-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {testimonials.map((test, index) => (
          <div key={index} className="w-full flex-shrink-0 snap-center flex items-center justify-center text-center px-2 md:px-12 min-h-[380px] md:min-h-[300px]">
            <div className="max-w-[720px] w-full">
              <div className="text-glow text-5xl md:text-6xl opacity-40 mb-4 md:mb-6 leading-none select-none font-serif">"</div>
              <p className="text-base md:text-xl text-white/95 italic font-light leading-relaxed mb-8 px-2 md:px-6">
                {test.text}
              </p>
              <div className="flex flex-col items-center justify-center">
                {test.logo ? (
                  <img src={test.logo} alt={test.name} className="w-12 h-12 object-contain p-1 rounded-full border border-white/10 bg-white/5 mb-3 shadow-[0_0_15px_rgba(74,222,128,0.15)]" />
                ) : (
                  <div className="w-12 h-12 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-sm font-black text-glow tracking-widest mb-3 shadow-[0_0_20px_rgba(74,222,128,0.15)]">
                    {test.initials}
                  </div>
                )}
                <h4 className="text-white font-bold tracking-wide text-sm md:text-base">{test.name}</h4>
                <span className="text-xs text-glow uppercase tracking-widest mt-1 font-medium">{test.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-4 md:mt-8">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToTestimonial(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-glow w-6' : 'bg-white/20 hover:bg-white/40'}`}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
