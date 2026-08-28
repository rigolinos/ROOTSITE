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
      category: 'Plataforma Corporativa • B2B', 
      stack: ['Governança Digital', 'Alta Performance', 'Design Exclusivo'], 
      url: 'https://deep-rules.vercel.app/', 
      gradient: 'from-cyan-900/40 to-cyan-950/40', 
      image: '/projects/deep-rules.png',
      description: 'Plataforma corporativa de ponta com governança digital, garantindo escalabilidade e controle arquitetural para empresas complexas.',
      bullets: ['Plataforma Corporativa', 'Alta Conversão', 'Design Exclusivo']
    },
    { 
      name: 'Mentes que Inspiram', 
      category: 'Experiência Imersiva • Mídia', 
      stack: ['Storytelling Visual', 'Cinematográfico', 'Interatividade'], 
      url: 'https://mentesqueinspiram.com/', 
      gradient: 'from-amber-900/40 to-amber-950/40', 
      image: '/projects/mentes-que-inspiram.png',
      description: 'Experiência digital imersiva para marca de mídia, desenhada com storytelling cinematográfico e transições fluidas que encantam a audiência.',
      bullets: ['Experiência Imersiva', 'Storytelling Premium', 'Engajamento Máximo']
    },
    { 
      name: 'Riff Sports', 
      category: 'Landing Page de Alta Conversão • SaaS', 
      stack: ['Captação de Clientes', 'Performance Extrema', 'Gestão de Quadras'], 
      url: 'https://riffsports.vercel.app/', 
      gradient: 'from-green-900/40 to-green-950/40', 
      image: '/projects/riff-sports.png',
      description: 'Ecossistema digital completo e landing page de alta conversão para gestão e agendamento esportivo, transformando visitantes em clientes ativos.',
      bullets: ['Landing Page de Alta Conversão', 'Performance Instantânea', 'Sistema Integrado']
    },
    { 
      name: 'Pet Connect', 
      category: 'Plataforma Institucional • Conexão', 
      stack: ['Sistema Inteligente', 'Painel de Gestão', 'Conectividade'], 
      url: 'https://petsupport.vercel.app/', 
      gradient: 'from-blue-900/40 to-blue-950/40', 
      image: '/projects/petconnect.png',
      description: 'Plataforma institucional inteligente que conecta doadores a necessidades urgentes com agilidade, clareza e painel de gestão intuitivo.',
      bullets: ['Plataforma Institucional', 'Gestão Simples', 'Confiabilidade']
    },
    { 
      name: 'Cabeleireiros App', 
      category: 'Marketplace • Agendamentos', 
      stack: ['Captação Rápida', 'Portfólio Digital', 'Agendamento Online'], 
      url: 'https://cabelereiros1.vercel.app/', 
      gradient: 'from-purple-900/40 to-purple-950/40', 
      image: '/projects/cabelereiros.png',
      description: 'Plataforma focada em agendamentos e exibição de portfólio para profissionais de beleza, facilitando o contato direto e conversão no WhatsApp.',
      bullets: ['Landing Page de Alta Conversão', 'Agendamento Prático', 'Visual Premium']
    },
    { 
      name: 'Seu Projeto Aqui', 
      category: 'Próximo Case', 
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

      <div className="portfolio-grid mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8" onMouseLeave={handleMouseLeaveGrid}>
        {projects.map((proj, i) => {
          const isLast = i === 5;
          const baseClasses = `portfolio-card-anim group relative flex flex-col justify-between p-5 rounded-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_0_24px_rgba(16,185,129,0.12)]`;
          const dynamicClasses = isLast
            ? 'bg-emerald-950/20 border border-emerald-500/30 hover:border-emerald-500/50'
            : 'bg-zinc-950/75 border border-white/[0.08] hover:border-emerald-500/40';

          return (
            <a
              key={i}
              href={proj.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${baseClasses} ${dynamicClasses}`}
              onMouseEnter={() => handleMouseEnter(i)}
            >
              {/* Top / Body */}
              <div className="flex flex-col items-start text-left">
                <div className="text-[11px] font-mono text-emerald-400/90 tracking-wider uppercase mb-2">
                  {proj.category}
                </div>
                <h3 className="text-lg font-bold text-white mb-1.5 transition-colors duration-300">
                  {proj.name}
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed line-clamp-2 mb-4 transition-colors duration-300">
                  {proj.description}
                </p>
              </div>

              {/* Bottom / Footer */}
              <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-semibold tracking-wider text-emerald-400/80 group-hover:text-emerald-300 transition-all duration-300 uppercase">
                <span>{isLast ? "INICIAR PROJETO" : "EXPLORAR PLATAFORMA"}</span>
                <span className="transform transition-transform duration-300 group-hover:translate-x-1.5 text-base leading-none">→</span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
