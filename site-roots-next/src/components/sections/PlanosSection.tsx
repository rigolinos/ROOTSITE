'use client';

import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-register';
import { MOTION } from '@/lib/animations';

/**
 * Planos Section — Horizontal Scroll Showcase
 * Cards scroll horizontally while viewport is pinned.
 * 3D tilt effect on desktop hover.
 */

const plans = [
  {
    icon: '🌱',
    name: 'Essencial',
    price: null,
    desc: 'Ideal para quem precisa lançar um produto, serviço ou campanha com foco total e imediato em captação de clientes.',
    features: [
      'Design focado em conversão direta para WhatsApp',
      'Otimização total para telas de celulares',
      'Formulários inteligentes de captação de leads',
      'Integração com ferramentas de anúncios e métricas'
    ],
    audience: 'Lançamentos e profissionais liberais',
    featured: false,
    badge: 'PROPOSTA SOB MEDIDA',
  },
  {
    icon: '🌿',
    name: 'Profissional',
    price: null,
    desc: 'A solução completa para empresas que buscam autoridade inquestionável, posicionamento premium e múltiplos canais de contato.',
    features: [
      'Múltiplas páginas personalizadas para cada serviço',
      'Painel amigável para você atualizar conteúdos (CMS)',
      'SEO avançado para sua empresa ser encontrada no Google',
      'Integração completa com CRM e automações'
    ],
    audience: 'Clínicas, escritórios e empresas B2B',
    featured: true,
    badge: '★ MAIS SOLICITADO',
  },
  {
    icon: '🌳',
    name: 'Experience',
    price: null,
    desc: 'Uma experiência visual cinematográfica com animações 3D e interatividade avançada para marcas que lideram seus mercados.',
    features: [
      'Animações interativas e elementos 3D sob medida',
      'Experiência de navegação exclusiva e memorável',
      'Arquitetura de altíssimo desempenho e segurança',
      'Design assinado para impressionar investidores'
    ],
    audience: 'Marcas de luxo, construtoras e startups',
    featured: false,
    badge: 'PROJETO EXCLUSIVO',
  },
];

export default function PlanosSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      // Title reveal
      gsap.fromTo(
        titleRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: MOTION.duration.default,
          ease: MOTION.ease.slide,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 40%',
            scrub: MOTION.scrub.smooth,
          },
        }
      );

      // Horizontal scroll — only on desktop
      const mm = ScrollTrigger.matchMedia({
        // Desktop: horizontal scroll
        '(min-width: 768px)': () => {
          const totalScroll = track.scrollWidth - window.innerWidth;

          gsap.to(track, {
            x: -totalScroll,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: `+=${totalScroll}`,
              pin: true,
              scrub: MOTION.scrub.smooth,
              anticipatePin: 1,
            },
          });

          // Cards stagger entrance
          cardsRef.current.forEach((card, i) => {
            if (!card) return;
            gsap.fromTo(
              card,
              { y: 60, opacity: 0, rotateY: -5 },
              {
                y: 0,
                opacity: 1,
                rotateY: 0,
                duration: MOTION.duration.default,
                ease: MOTION.ease.slide,
                scrollTrigger: {
                  trigger: card,
                  start: 'left 80%',
                  end: 'left 40%',
                  scrub: MOTION.scrub.smooth,
                  containerAnimation: gsap.getById?.('horizontal') || undefined,
                },
              }
            );
          });
        },

        // Mobile: vertical reveal with stagger
        '(max-width: 767px)': () => {
          cardsRef.current.forEach((card, i) => {
            if (!card) return;
            gsap.fromTo(
              card,
              { y: 60, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: MOTION.duration.default,
                delay: i * 0.15,
                ease: MOTION.ease.slide,
                scrollTrigger: {
                  trigger: card,
                  start: 'top 85%',
                  toggleActions: 'play none none reverse',
                },
              }
            );
          });
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // 3D Tilt handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(card, {
      rotateY: x * 10,
      rotateX: -y * 10,
      duration: 0.4,
      ease: 'power3.out',
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('root-hover', { detail: { segmentId: String(index) } }));
    }
  };

  const handleMouseLeave = (index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;

    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      duration: MOTION.duration.min,
      ease: MOTION.ease.fade,
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('root-hover', { detail: { segmentId: null } }));
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ minHeight: '100dvh' }}
    >
      {/* Title */}
      <div ref={titleRef} className="text-center pt-20 md:pt-32 pb-10 md:pb-16 px-6 opacity-0 max-w-3xl mx-auto">
        <h2
          className="text-white mb-3 text-glow"
          style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          Soluções Sob Medida
        </h2>
        <p className="text-white/70 text-base md:text-xl font-light tracking-wide">
          Escolha o formato ideal para o momento do seu negócio.
        </p>
      </div>

      {/* Cards Track */}
      <div
        ref={trackRef}
        className="flex md:flex-nowrap flex-wrap gap-6 md:gap-8 px-6 md:px-20 pb-20 md:pb-0 justify-center md:justify-start"
        style={{ perspective: '1200px' }}
      >
        {plans.map((plan, i) => (
          <div
            key={plan.name}
            ref={(el) => { cardsRef.current[i] = el; }}
            className={`
              glass-card relative overflow-hidden
              w-full md:w-[400px] md:min-w-[400px]
              p-8 md:p-10 flex flex-col
              transition-all duration-500
              hover:-translate-y-2
              ${plan.featured ? 'glass-card-featured' : ''}
            `}
            style={{ transformStyle: 'preserve-3d' }}
            onMouseMove={(e) => handleMouseMove(e, i)}
            onMouseLeave={() => handleMouseLeave(i)}
            data-cursor="pointer"
          >
            {/* Featured top line */}
            {plan.featured && (
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{
                  background: 'linear-gradient(90deg, transparent, #4ADE80, transparent)',
                }}
              />
            )}

            {/* Badge */}
            {plan.badge && (
              <span
                className="absolute top-4 right-4 text-glow px-3 py-1 rounded-full"
                style={{
                  fontSize: '0.65rem',
                  background: 'rgba(74, 222, 128, 0.15)',
                  color: '#4ADE80',
                  fontWeight: 600,
                }}
              >
                {plan.badge}
              </span>
            )}

            <span className="text-3xl mb-4">{plan.icon}</span>\r
            <h3 className="text-white text-xl font-bold mb-2">{plan.name}</h3>\r
            {plan.price && <p className="text-glow text-sm font-semibold mb-4">{plan.price}</p>}\r
            <p className="text-white/60 text-sm mb-6 leading-relaxed">{plan.desc}</p>

            <ul className="flex-1 space-y-2 mb-6">
              {plan.features.map((feat) => (
                <li key={feat} className="text-white/60 text-sm pl-5 relative">
                  <span className="absolute left-0 text-glow text-xs font-bold">✓</span>
                  {feat}
                </li>
              ))}
            </ul>

            <span
              className="text-sage uppercase text-xs font-semibold"
              style={{ letterSpacing: '0.1em' }}
            >
              {plan.audience}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
