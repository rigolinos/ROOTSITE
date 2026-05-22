'use client';

import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-register';
import { MOTION } from '@/lib/animations';
import MagneticButton from '@/components/effects/MagneticButton';

/**
 * CTA Section + Mega Footer
 * Large typography "Vamos cultivar juntos." + WhatsApp CTA
 */
export default function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const megaTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // CTA Title
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
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Subtitle
      gsap.fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: MOTION.duration.default,
          delay: MOTION.delay.secondary,
          ease: MOTION.ease.fade,
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Button (after content stabilizes)
      gsap.fromTo(
        buttonRef.current,
        { y: 20, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: MOTION.duration.default,
          delay: MOTION.delay.afterPrimary,
          ease: MOTION.ease.slide,
          scrollTrigger: {
            trigger: section,
            start: 'top 50%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Mega footer text
      gsap.fromTo(
        megaTextRef.current,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: MOTION.duration.slow,
          ease: MOTION.ease.slide,
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* CTA Section */}
      <section
        ref={sectionRef}
        className="relative w-full flex items-center justify-center overflow-hidden py-32 md:py-48"
        style={{ minHeight: '80dvh' }}
      >
        <div className="relative z-10 text-center max-w-3xl px-6">
          <h2
            ref={titleRef}
            className="text-white mb-4 opacity-0"
            style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            O ciclo
            <br />
            continua.
          </h2>

          <p
            ref={subtitleRef}
            className="mb-10 opacity-0"
            style={{
              fontSize: 'clamp(0.9rem, 1.5vw, 1.15rem)',
              fontWeight: 400,
              lineHeight: 1.8,
              color: 'rgba(255, 255, 255, 0.6)',
            }}
          >
            Pronto para cultivar seu ecossistema digital?
          </p>

          <div ref={buttonRef} className="opacity-0">
            <MagneticButton strength={0.25}>
              <a
                href="#"
                className="cta-button inline-flex items-center gap-3 px-10 py-4 rounded-full font-semibold text-lg transition-all duration-500 animate-glow-pulse"
                style={{
                  background: '#1B3022',
                  color: '#FFFFFF',
                  border: '1px solid rgba(74, 222, 128, 0.3)',
                  letterSpacing: '0.05em',
                  textDecoration: 'none',
                }}
                data-cursor="pointer"
              >
                <span className="text-xl">💬</span>
                Fale conosco
              </a>
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* Mega Footer */}
      <footer
        ref={footerRef}
        className="relative w-full overflow-hidden py-20 md:py-32"
        style={{ borderTop: '1px solid rgba(152, 169, 154, 0.1)' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Mega typography */}
          <div ref={megaTextRef} className="mb-16 opacity-0">
            <h3
              className="text-white"
              style={{
                fontSize: 'clamp(2.5rem, 10vw, 8rem)',
                fontWeight: 800,
                lineHeight: 0.95,
                letterSpacing: '-0.03em',
                color: 'rgba(255, 255, 255, 0.06)',
              }}
            >
              Vamos cultivar
              <br />
              juntos.
            </h3>
          </div>

          {/* Footer info */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div>
              <p className="text-sage text-sm font-semibold mb-2" style={{ letterSpacing: '0.2em' }}>
                ROOT CODE
              </p>
              <p className="text-white/40 text-xs leading-relaxed">
                Cultivando ecossistemas digitais
                <br />
                onde a complexidade técnica floresce
                <br />
                em simplicidade arquitetônica.
              </p>
            </div>

            <div className="text-right">
              <p className="text-white/30 text-xs">
                © {new Date().getFullYear()} Deep Roots. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
