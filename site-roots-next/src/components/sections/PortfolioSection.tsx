'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from '@/lib/gsap-register';
import { MOTION } from '@/lib/animations';

interface PortfolioSectionProps {
  isActive: boolean;
}

export default function PortfolioSection({ isActive }: PortfolioSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const projects = [
    { 
      name: 'Deep Rules', 
      category: 'B2B PLATFORM', 
      stack: ['React', 'Next.js', 'Governança'], 
      url: 'https://deep-rules.vercel.app/', 
      gradient: 'from-cyan-900/40 to-cyan-950/40', 
      image: '/projects/deep-rules.png',
      description: 'Plataforma corporativa de ponta com governança digital, garantindo escalabilidade e controle arquitetural para empresas complexas.',
      bullets: ['Plataforma Corporativa', 'Alta Conversão', 'Design Exclusivo']
    },
    { 
      name: 'Mentes que Inspiram', 
      category: 'IMMERSIVE WEB', 
      stack: ['WebGL', 'Next.js', 'Framer'], 
      url: 'https://mentesqueinspiram.com/', 
      gradient: 'from-amber-900/40 to-amber-950/40', 
      image: '/projects/mentes-que-inspiram.png',
      description: 'Experiência digital imersiva para marca de mídia, desenhada com storytelling cinematográfico e transições fluidas que encantam a audiência.',
      bullets: ['Experiência Imersiva', 'Storytelling Premium', 'Engajamento Máximo']
    },
    { 
      name: 'Riff Sports', 
      category: 'SAAS', 
      stack: ['React', 'Tailwind', 'API'], 
      url: 'https://riffsports.vercel.app/', 
      gradient: 'from-green-900/40 to-green-950/40', 
      image: '/projects/riff-sports.png',
      description: 'Ecossistema digital completo e landing page de alta conversão para gestão e agendamento esportivo, transformando visitantes em clientes ativos.',
      bullets: ['Landing Page de Alta Conversão', 'Performance Instantânea', 'Sistema Integrado']
    },
    { 
      name: 'Pet Connect', 
      category: 'DASHBOARD', 
      stack: ['Next.js', 'TypeScript', 'UI/UX'], 
      url: 'https://petsupport.vercel.app/', 
      gradient: 'from-blue-900/40 to-blue-950/40', 
      image: '/projects/petconnect.png',
      description: 'Plataforma institucional inteligente que conecta doadores a necessidades urgentes com agilidade, clareza e painel de gestão intuitivo.',
      bullets: ['Plataforma Institucional', 'Gestão Simples', 'Confiabilidade']
    },
    { 
      name: 'Cabeleireiros App', 
      category: 'MARKETPLACE', 
      stack: ['React', 'Supabase', 'Vercel'], 
      url: 'https://cabelereiros1.vercel.app/', 
      gradient: 'from-purple-900/40 to-purple-950/40', 
      image: '/projects/cabelereiros.png',
      description: 'Plataforma focada em agendamentos e exibição de portfólio para profissionais de beleza, facilitando o contato direto e conversão no WhatsApp.',
      bullets: ['Landing Page de Alta Conversão', 'Agendamento Prático', 'Visual Premium']
    },
    { 
      name: 'Seu Projeto Aqui', 
      category: 'PRÓXIMO CASE', 
      stack: ['Sob Medida', 'Inovação', 'Futuro'], 
      url: 'https://wa.me/5551999019398', 
      gradient: 'from-emerald-900/40 to-emerald-950/40', 
      image: '',
      description: 'Desenvolvemos a sua plataforma sob medida com arquitetura de ponta e foco total nos seus resultados comerciais.',
      bullets: ['Arquitetura de Ponta', 'Resultados Comerciais', 'Foco no Futuro']
    },
  ];

  const [activeProject, setActiveProject] = useState<number>(0);



  const handleMouseEnter = (i: number) => {
    setActiveProject(i);
  };

  const handleMouseLeaveGrid = () => {
    setActiveProject(-1);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const cardsEls = gsap.utils.toArray<HTMLElement>('.portfolio-card-anim');

      if (isActive) {
        gsap.set('.section-title', { opacity: 0, y: 30 });
        gsap.set(cardsEls, { opacity: 0, y: 100, scale: 0.95 });

        const tl = gsap.timeline({ delay: 0.1 });

        tl.to('.section-title', {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: MOTION.ease.reveal,
        });

        // Initialize metadata state
        gsap.set('.meta-stack', { y: 20, opacity: 0 });

        tl.to(cardsEls, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.1,
          ease: MOTION.ease.reveal,
        }, '-=0.4');
      } else {
        gsap.to(containerRef.current, { opacity: 0, duration: 0.4 });
      }
    }, containerRef);

    if (isActive) {
      const tl = gsap.timeline();
      tl.to(containerRef.current, { opacity: 1, duration: 0.4 });
      
      // Animate the structural cross lines
      const hLine = containerRef.current?.querySelector('.cross-line-h');
      const vLine = containerRef.current?.querySelector('.cross-line-v');
      if (hLine && vLine) {
        tl.to([hLine, vLine], { scaleX: 1, scaleY: 1, duration: 1.2, ease: 'expo.inOut', stagger: 0.2 }, "-=0.2");
      }
    }

    return () => ctx.revert();
  }, [isActive]);

  return (
    <div 
      className="section-content w-full max-w-[1200px] opacity-0 px-4 md:px-8" 
      ref={containerRef} 
    >
      <h2 
        className="section-title text-center mb-10 md:mb-16 relative z-20"
      >
        <span className="text-glow tracking-[0.25em] font-semibold text-xs md:text-sm block mb-3 uppercase">Casos de Sucesso</span>
        <span className="text-white font-light tracking-wide text-xl md:text-3xl normal-case block max-w-2xl mx-auto leading-snug">
          Ecossistemas digitais desenhados para autoridade e alta conversão.
        </span>
      </h2>

      <div className="portfolio-grid mx-auto relative z-10 grid grid-cols-1 md:grid-cols-6 gap-6 md:gap-8 max-w-5xl" onMouseLeave={handleMouseLeaveGrid}>
        {projects.map((proj, i) => {
          const isLast = i === 5;
          let colSpan = 'md:col-span-2';
          if (i === 0 || i === 1) colSpan = 'md:col-span-3'; // Top row (Destaques)

          if (isLast) {
            return (
              <a
                key={i}
                href={proj.url}
                target="_blank"
                rel="noopener noreferrer"
                className="portfolio-card-anim md:col-span-6 group relative flex flex-col md:flex-row items-center justify-between p-8 md:p-10 rounded-2xl backdrop-blur-xl transition-all duration-300 border-2 border-dashed border-emerald-500/40 bg-gradient-to-r from-emerald-950/20 to-transparent hover:border-emerald-400/60 hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)] hover:-translate-y-1 gap-6"
                onMouseEnter={() => handleMouseEnter(i)}
              >
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                    Próximo Case: Seu Projeto Aqui
                  </h3>
                  <p className="text-sm text-stone-300 leading-relaxed max-w-xl">
                    Desenvolvemos a sua plataforma sob medida com arquitetura de ponta e foco total nos seus resultados comerciais.
                  </p>
                </div>
                <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 font-semibold text-xs px-5 py-2.5 rounded-full uppercase tracking-widest transition-colors flex items-center gap-2 flex-shrink-0">
                  Solicitar Proposta no WhatsApp
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
              </a>
            );
          }

          return (
            <a
              key={i}
              href={proj.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`portfolio-card-anim ${colSpan} group relative flex flex-col justify-between p-6 rounded-2xl min-h-[160px] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)] bg-[#080d0a]/80 border border-white/[0.08] hover:border-emerald-500/40 overflow-hidden`}
              onMouseEnter={() => handleMouseEnter(i)}
            >
              {/* Background Glow on hover */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(circle at top right, rgba(16, 185, 129, 0.12), transparent 60%)'}} />

              {/* Top Header */}
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="text-[10px] font-sans font-semibold tracking-wider text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase shadow-sm">
                  {proj.category}
                </div>
                <div className="text-stone-500 group-hover:text-emerald-400 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7"></path>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-col items-start text-left relative z-10 flex-1">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                  {proj.name}
                </h3>
                <p className="text-xs md:text-sm text-stone-300 leading-relaxed mb-6">
                  {proj.description}
                </p>
              </div>

              {/* Footer Stack Tags */}
              <div className="flex flex-wrap items-center gap-2 relative z-10 mt-auto">
                {proj.stack.map((tech, idx) => (
                  <span key={idx} className="text-[10px] font-sans text-stone-300 font-medium tracking-wide bg-white/[0.04] border border-white/[0.05] px-2 py-0.5 rounded shadow-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
