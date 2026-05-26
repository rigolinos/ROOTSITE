'use client';

import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-register';
import { MOTION } from '@/lib/animations';

/**
 * Semente + Código — Pinned Camera Scroll Section
 * Two reveals within a single pinned viewport, controlled by scroll.
 * 
 * CAMADA 03: Pin & Parallax Dinâmico
 */
export default function CameraScrollSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sementeRef = useRef<HTMLDivElement>(null);
  const codigoRef = useRef<HTMLDivElement>(null);
  const bgOrb1Ref = useRef<HTMLDivElement>(null);
  const bgOrb2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=250%',
          pin: true,
          scrub: MOTION.scrub.cinematic,
          anticipatePin: 1,
        },
      });

      // ── Phase 1: "A Semente" reveals ──
      tl.fromTo(
        sementeRef.current,
        { y: 80, opacity: 0, filter: 'blur(10px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: MOTION.duration.default,
          ease: MOTION.ease.slide,
        }
      );

      // Background orb 1 parallax (opposite direction)
      tl.fromTo(
        bgOrb1Ref.current,
        { y: 100, scale: 0.8 },
        { y: -100, scale: 1.2, duration: MOTION.duration.slow },
        '<'
      );

      // Hold "Semente" visible
      tl.to(sementeRef.current, { opacity: 1, duration: 0.5 });

      // ── Phase 2: "Semente" exits, "Código" enters ──
      tl.to(sementeRef.current, {
        y: -60,
        opacity: 0,
        filter: 'blur(8px)',
        duration: MOTION.duration.min,
        ease: MOTION.ease.fade,
      });

      tl.fromTo(
        codigoRef.current,
        { y: 80, opacity: 0, filter: 'blur(10px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: MOTION.duration.default,
          ease: MOTION.ease.slide,
        },
        '-=0.3'
      );

      // Background orb 2 parallax
      tl.fromTo(
        bgOrb2Ref.current,
        { y: 80, x: -50, scale: 0.9 },
        { y: -120, x: 50, scale: 1.1, duration: MOTION.duration.slow },
        '<'
      );

      // Hold "Código" visible
      tl.to(codigoRef.current, { opacity: 1, duration: 0.5 });

      // ── Phase 3: "Código" exits ──
      tl.to(codigoRef.current, {
        y: -60,
        opacity: 0,
        duration: MOTION.duration.min,
        ease: MOTION.ease.fade,
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: '100dvh' }}
    >
      {/* Parallax background orbs */}
      <div
        ref={bgOrb1Ref}
        className="absolute top-1/4 -left-20 w-96 h-96 rounded-full will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(74, 222, 128, 0.04) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        aria-hidden="true"
      />
      <div
        ref={bgOrb2Ref}
        className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(152, 169, 154, 0.06) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        aria-hidden="true"
      />

      {/* Content container — centered */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        {/* A Semente */}
        <div
          ref={sementeRef}
          className="absolute text-center max-w-3xl px-6 opacity-0"
        >
          <h2
            className="text-white mb-6"
            style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            Toda revolução digital
            <br />
            começa com uma ideia.
          </h2>
          <p
            className="max-w-lg mx-auto"
            style={{
              fontSize: 'clamp(0.9rem, 1.5vw, 1.15rem)',
              fontWeight: 400,
              lineHeight: 1.8,
              color: 'rgba(255, 255, 255, 0.6)',
            }}
          >
            Transformamos conceitos em ecossistemas digitais — onde cada linha de
            código e cada automação se tornam raízes otimizadas que sustentam o crescimento dos seus processos e negócios.
          </p>
        </div>

        {/* O Código-Raiz */}
        <div
          ref={codigoRef}
          className="absolute text-center max-w-3xl px-6 opacity-0"
        >
          <h2
            className="text-white mb-6"
            style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            Raízes invisíveis.
            <br />
            Estrutura inabalável.
          </h2>
          <p
            className="max-w-lg mx-auto"
            style={{
              fontSize: 'clamp(0.9rem, 1.5vw, 1.15rem)',
              fontWeight: 400,
              lineHeight: 1.8,
              color: 'rgba(255, 255, 255, 0.6)',
            }}
          >
            Código limpo e processos otimizados — a base sólida que sustenta todo o
            ecossistema. Firme, invisível, mas estruturando o crescimento do seu negócio.
          </p>
        </div>
      </div>
    </section>
  );
}
