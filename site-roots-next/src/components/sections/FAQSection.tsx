'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap-register';
import { MOTION } from '@/lib/animations';

interface FAQSectionProps {
  isActive: boolean;
}

export default function FAQSection({ isActive }: FAQSectionProps) {
  const faqs = [
    { q: 'Quanto tempo leva para criar um site?', a: 'Depende da complexidade. Um site Essencial leva de 2 a 3 semanas. Profissional, de 4 a 6 semanas. Experience, de 6 a 12 semanas. Trabalhamos com sprints semanais para que você acompanhe a evolução em tempo real.' },
    { q: 'Vocês fazem sites para qualquer nicho?', a: 'Sim. Já atendemos clínicas, escritórios de advocacia, e-commerces, startups de tecnologia e projetos pessoais. Cada projeto é customizado — não usamos templates.' },
    { q: 'O que está incluído na manutenção mensal?', a: 'No plano Standard (R$ 250/mês): hospedagem monitorada, backups, atualizações de segurança e suporte técnico. No Growth (R$ 500/mês): tudo do Standard + relatório mensal de métricas, call estratégica e evolução contínua do site.' },
    { q: 'Posso pedir alterações depois que o site está pronto?', a: 'Claro. Oferecemos 30 dias de garantia pós-entrega para ajustes. Após esse período, alterações são feitas via plano de manutenção ou sob orçamento pontual.' },
    { q: 'Vocês trabalham com SEO?', a: 'Sim. Todos os nossos sites são construídos com SEO técnico otimizado: meta tags, estrutura semântica, performance Lighthouse 95+, sitemap e schema markup. Para SEO de conteúdo (blog, palavras-chave), oferecemos como serviço adicional.' },
    { q: 'Como funciona o pagamento?', a: 'Trabalhamos com 50% na aprovação do projeto e 50% na entrega. Para planos de manutenção, a cobrança é mensal via Pix ou boleto.' },
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
      
      <div className="faq-accordion space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className={`faq-item transition-all duration-300 ${openIndex === i ? 'active bg-black/40 shadow-[0_0_20px_rgba(74,222,128,0.05)]' : ''}`}>
            <button
              onClick={() => toggle(i)}
              className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer border-none bg-transparent outline-none group"
            >
              <span className={`text-sm md:text-base font-medium transition-colors ${openIndex === i ? 'text-glow' : 'text-white group-hover:text-white/80'}`}>
                {faq.q}
              </span>
              <span className={`text-xl transition-transform duration-300 text-glow opacity-70 ${openIndex === i ? 'rotate-45' : ''}`}>
                +
              </span>
            </button>
            <div
              ref={(el) => {
                contentRefs.current[i] = el;
              }}
              className="overflow-hidden h-0 opacity-0"
            >
              <div className="px-6 pb-5 text-sm text-white/60 leading-relaxed border-t border-white/5 pt-4">
                {faq.a}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
