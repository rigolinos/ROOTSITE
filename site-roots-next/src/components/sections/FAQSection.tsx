'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap-register';
import { MOTION } from '@/lib/animations';

interface FAQSectionProps {
  isActive: boolean;
}

export default function FAQSection({ isActive }: FAQSectionProps) {
  const faqs = [
    { 
      q: 'Quanto tempo leva para meu site ficar pronto?', 
      a: 'Projetos focados em conversão (Landing Pages) levam de 2 a 3 semanas. Sites institucionais completos levam de 4 a 6 semanas. Apresentamos prévias semanais para você acompanhar tudo de perto.' 
    },
    { 
      q: 'Não entendo nada de tecnologia. Vocês me ajudam após a entrega?', 
      a: 'Com certeza! Entregamos o site pronto para usar e fornecemos treinamento simples para você ou sua equipe. Além disso, oferecemos nossos planos de gestão mensal para cuidarmos de tudo por você.' 
    },
    { 
      q: 'Por que não usar um construtor de sites gratuito ou um template pronto?', 
      a: 'Templates prontos são lentos, genéricos e parecem iguais a milhares de outros na internet. Um site exclusivo da Root Code é construído do zero para a sua marca, carrega instantaneamente e passa a autoridade que seu cliente exige.' 
    },
    { 
      q: 'O site já vem preparado para aparecer no Google?', 
      a: 'Sim! Todos os nossos sites são entregues com a estrutura técnica perfeita que o Google exige para indexar e ranquear sua empresa com rapidez.' 
    },
    { 
      q: 'Como funciona o investimento e o pagamento?', 
      a: 'Trabalhamos com pagamento facilitado (50% no início do projeto e 50% na entrega). Cada projeto recebe um orçamento personalizado de acordo com as necessidades do seu negócio.' 
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);
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

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    contentRefs.current.forEach((el, i) => {
      if (!el) return;
      if (openIndex === i) {
        gsap.to(el, { height: 'auto', opacity: 1, duration: 0.4, ease: 'back.out(1.2)' });
      } else {
        gsap.to(el, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.out' });
      }
    });
  }, [openIndex]);

  return (
    <div className="section-content w-full max-w-[800px]" ref={containerRef} style={{ opacity: 0 }}>
      <h2 
        className="section-title text-glow text-center mb-16 uppercase tracking-widest"
        style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}
      >
        Perguntas Frequentes
      </h2>
      <p className="text-center text-white/40 text-xs tracking-wider uppercase mb-10 -mt-10">
        {faqs.length} perguntas · Clique para expandir
      </p>
      
      <div className="faq-accordion space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className={`faq-item transition-all duration-300 ${openIndex === i ? 'active bg-black/40 shadow-[0_0_20px_rgba(74,222,128,0.05)]' : ''}`}>
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between text-left cursor-pointer border-none bg-transparent outline-none group"
              style={{ padding: '1.25rem 1.5rem' }}
            >
              <span className={`text-[15px] md:text-base pr-4 font-medium transition-colors ${openIndex === i ? 'text-glow' : 'text-white group-hover:text-white/80'}`}>
                {faq.q}
              </span>
              <span className={`transition-transform duration-300 text-glow opacity-70 flex items-center justify-center w-6 h-6 ${openIndex === i ? 'rotate-45' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </span>
            </button>
            <div
              ref={(el) => {
                contentRefs.current[i] = el;
              }}
              className="overflow-hidden h-0 opacity-0"
            >
              <div 
                className="text-[14px] text-white/70 leading-relaxed border-t border-white/5"
                style={{ padding: '0.85rem 1.5rem 1.25rem 1.5rem' }}
              >
                {faq.a}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
