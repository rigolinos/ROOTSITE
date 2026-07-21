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
  ];

  const portalRef = useRef<HTMLDivElement>(null);
  const xTo = useRef<any>(null);
  const yTo = useRef<any>(null);
  const [mounted, setMounted] = useState(false);
  const [activeProject, setActiveProject] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (portalRef.current) {
      gsap.set(portalRef.current, { 
        xPercent: -50, 
        yPercent: -120,
        scale: 0.8,
        opacity: 0,
        filter: 'blur(10px)'
      });
      xTo.current = gsap.quickTo(portalRef.current, 'x', { duration: 0.15, ease: 'power3' });
      yTo.current = gsap.quickTo(portalRef.current, 'y', { duration: 0.15, ease: 'power3' });
    }

    const handleWindowMouseMove = (e: MouseEvent) => {
      if (xTo.current && yTo.current) {
        xTo.current(e.clientX);
        yTo.current(e.clientY);
      }
    };
    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, [mounted]);

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

      <div className="portfolio-grid mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 md:border-y border-white/[0.05]" onMouseLeave={handleMouseLeaveGrid}>
        {/* Animated Cross Lines (Horizontal & Vertical) */}
        <div className="cross-line-h hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-glow/20 pointer-events-none scale-x-0 origin-center z-20" />
        <div className="cross-line-v hidden md:block absolute top-0 left-1/2 w-[1px] h-full bg-glow/20 pointer-events-none scale-y-0 origin-center z-20" />

        {projects.map((proj, i) => (
          <a
            key={i}
            href={proj.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`portfolio-card-anim block no-underline group relative overflow-hidden cursor-pointer border-b border-white/[0.05] transition-all duration-500 hover:bg-white/[0.03] ${
              i === 4 ? 'md:col-span-2' : ''
            } ${
              i % 2 === 0 && i !== 4 ? 'md:border-r border-white/[0.05]' : ''
            }`}
            onMouseEnter={() => handleMouseEnter(i)}
          >
            {/* Content */}
            <div className="flex flex-col items-center justify-center text-center py-10 px-6 md:py-14 md:px-12 bg-[#0A0F0D]/40 transition-colors duration-500 group-hover:bg-transparent">
              <div className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] text-glow mb-3">{proj.category}</div>
              <h3 className="text-2xl md:text-4xl font-light tracking-tight text-white group-hover:text-glow transition-colors duration-300 mb-4">{proj.name}</h3>
              <p className="text-xs md:text-sm text-white/75 font-light max-w-md leading-relaxed mb-6 group-hover:text-white/95 transition-colors duration-300">
                {proj.description}
              </p>
              
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-white/60 group-hover:text-glow transition-all duration-300">
                <span>Acessar Plataforma</span>
                <span className="transform transition-transform duration-300 group-hover:translate-x-1.5">→</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
