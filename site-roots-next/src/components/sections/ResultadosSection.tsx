'use client';

import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-register';
import { MOTION } from '@/lib/animations';

const stats = [
  { value: 30, suffix: '', label: 'dias de garantia\npós-entrega' },
  { value: 100, suffix: '%', label: 'foco em performance\ntécnica' },
  { value: 24, suffix: '/7', label: 'monitoramento\nde uptime' },
];

/**
 * Resultados Section — Stats with counter animation.
 * Numbers count from 0 to target value with power4.out ease.
 */
export default function ResultadosSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<(HTMLDivElement | null)[]>([]);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
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
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Counter animations
      stats.forEach((stat, i) => {
        const numberEl = numberRefs.current[i];
        const statEl = statsRef.current[i];
        if (!numberEl || !statEl) return;

        // Stat card entrance
        gsap.fromTo(
          statEl,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: MOTION.duration.default,
            delay: i * MOTION.stagger.sections,
            ease: MOTION.ease.slide,
            scrollTrigger: {
              trigger: section,
              start: 'top 60%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // Counter
        const counter = { val: 0 };
        gsap.to(counter, {
          val: stat.value,
          duration: MOTION.duration.slow * 1.5,
          delay: MOTION.delay.afterPrimary + i * MOTION.stagger.sections,
          ease: MOTION.ease.slide,
          scrollTrigger: {
            trigger: section,
            start: 'top 55%',
            toggleActions: 'play none none reverse',
          },
          onUpdate: () => {
            numberEl.textContent = Math.round(counter.val).toString();
          },
        });
      });

      // Subtitle (after stats)
      gsap.fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: MOTION.duration.default,
          ease: MOTION.ease.fade,
          scrollTrigger: {
            trigger: section,
            start: 'top 45%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full flex items-center justify-center overflow-hidden py-32 md:py-48"
      style={{ minHeight: '80dvh' }}
    >
      <div className="relative z-10 text-center max-w-4xl px-6">
        <div ref={titleRef} className="mb-10 opacity-0">
          <h2
            className="text-white"
            style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            Eficiência
            <br />
            que se mede.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              ref={(el) => { statsRef.current[i] = el; }}
              className="text-center opacity-0"
            >
              <div style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1, color: '#C8A96E' }}>
                <span ref={(el) => { numberRefs.current[i] = el; }}>0</span>
                <span>{stat.suffix}</span>
              </div>
              <div
                className="mt-2"
                style={{
                  fontSize: '0.8rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-line',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <p
          ref={subtitleRef}
          className="max-w-lg mx-auto opacity-0"
          style={{
            fontSize: 'clamp(0.9rem, 1.5vw, 1.15rem)',
            fontWeight: 400,
            lineHeight: 1.8,
            color: 'rgba(255, 255, 255, 0.6)',
          }}
        >
          Performance técnica sem ruídos — garantindo que o software seja uma
          ferramenta de simplificação para o seu negócio.
        </p>
      </div>
    </section>
  );
}
