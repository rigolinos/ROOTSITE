'use client';

import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-register';
import { MOTION } from '@/lib/animations';

const tiers = [
  {
    name: 'Suporte Standard',
    price: 'R$ 250',
    period: '/mês',
    features: ['Manutenção preventiva', 'Hospedagem monitorada', 'Apoio técnico'],
    featured: false,
  },
  {
    name: 'Gestão Growth',
    price: 'R$ 500',
    period: '/mês',
    features: [
      'Tudo do Standard',
      'Relatório mensal de dados',
      'Call estratégica mensal',
      'Evolução contínua',
    ],
    featured: true,
  },
];

/**
 * Performance Section — Gestão tiers with curtain reveal.
 */
export default function PerformanceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const curtainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Curtain wipe reveal
      gsap.fromTo(
        curtainRef.current,
        { scaleX: 1 },
        {
          scaleX: 0,
          duration: MOTION.duration.slow,
          ease: MOTION.ease.reveal,
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Title
      gsap.fromTo(
        titleRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: MOTION.duration.default,
          ease: MOTION.ease.slide,
          scrollTrigger: {
            trigger: section,
            start: 'top 65%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards stagger
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: MOTION.duration.default,
            delay: MOTION.delay.afterPrimary + i * MOTION.stagger.cards,
            ease: MOTION.ease.slide,
            scrollTrigger: {
              trigger: section,
              start: 'top 55%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full flex items-center justify-center overflow-hidden py-32 md:py-48"
      style={{ minHeight: '80dvh' }}
    >
      {/* Curtain wipe overlay */}
      <div
        ref={curtainRef}
        className="absolute inset-0 z-20 origin-right pointer-events-none"
        style={{ backgroundColor: '#0A0F0D' }}
        aria-hidden="true"
      />

      <div className="relative z-10 text-center max-w-4xl px-6">
        <div ref={titleRef} className="mb-10 opacity-0">
          <h2
            className="text-white mb-4"
            style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            Gestão que evolui
            <br />
            com você.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {tiers.map((tier, i) => (
            <div
              key={tier.name}
              ref={(el) => { cardsRef.current[i] = el; }}
              className={`glass-card p-8 text-left transition-all duration-500 hover:-translate-y-1 opacity-0 ${
                tier.featured ? 'glass-card-featured' : ''
              }`}
              data-cursor="pointer"
            >
              {tier.featured && (
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{
                    background: 'linear-gradient(90deg, transparent, #4ADE80, transparent)',
                  }}
                />
              )}

              <h3 className="text-white text-lg font-bold mb-3">{tier.name}</h3>
              <div className="mb-6">
                <span
                  className="text-glow"
                  style={{ fontSize: '2rem', fontWeight: 800, color: '#4ADE80' }}
                >
                  {tier.price}
                </span>
                <span className="text-white/60 text-sm ml-1">{tier.period}</span>
              </div>

              <ul className="space-y-2">
                {tier.features.map((feat) => (
                  <li key={feat} className="text-white/60 text-sm pl-5 relative">
                    <span className="absolute left-0 text-glow text-xs font-bold">✓</span>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
