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
      className="relative z-10 w-full max-w-5xl mx-auto min-h-screen flex flex-col justify-center items-center px-4 md:px-8 py-16 opacity-0" 
      ref={containerRef} 
    >
      <h2 
        className="section-title text-center mb-10 md:mb-16 relative z-20 w-full"
      >
        <span className="text-glow tracking-[0.25em] font-semibold text-xs md:text-sm block mb-3 uppercase">Casos de Sucesso</span>
        <span className="text-white font-light tracking-wide text-xl md:text-3xl normal-case block max-w-2xl mx-auto leading-snug">
          Ecossistemas digitais desenhados para autoridade e alta conversão.
        </span>
      </h2>

      <div className="w-full max-w-5xl mx-auto flex flex-col gap-4" onMouseLeave={handleMouseLeaveGrid}>
        
        {/* Linha 1 (2 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {projects.slice(0, 2).map((proj, i) => (
            <a
              key={i}
              href={proj.url}
              target="_blank"
              rel="noopener noreferrer"
              className="portfolio-card-anim rounded-2xl border border-white/[0.08] bg-[#080d0a]/85 transition-all hover:border-emerald-500/40 group"
              style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '190px', position: 'relative' }}
              onMouseEnter={() => handleMouseEnter(i)}
            >
              <div className="text-left w-full relative z-10">
                <div className="flex items-center justify-between mb-3 w-full">
                  <span className="text-[11px] font-sans font-medium tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full uppercase">
                    {proj.category}
                  </span>
                  <span className="text-stone-500 text-sm group-hover:text-emerald-400 transition-colors">↗</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">{proj.name}</h3>
                <p className="text-xs text-stone-300 leading-relaxed">{proj.description}</p>
              </div>
              <div className="flex flex-wrap gap-2 pt-3 mt-4 border-t border-white/[0.06] w-full relative z-10">
                {proj.stack.map((tech, idx) => (
                  <span key={idx} className="text-[10px] font-mono text-stone-400 bg-white/[0.04] px-2 py-0.5 rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>

        {/* Linha 2 (3 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {projects.slice(2, 5).map((proj, i) => (
            <a
              key={i + 2}
              href={proj.url}
              target="_blank"
              rel="noopener noreferrer"
              className="portfolio-card-anim rounded-2xl border border-white/[0.08] bg-[#080d0a]/85 transition-all hover:border-emerald-500/40 group"
              style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '190px', position: 'relative' }}
              onMouseEnter={() => handleMouseEnter(i + 2)}
            >
              <div className="text-left w-full relative z-10">
                <div className="flex items-center justify-between mb-3 w-full">
                  <span className="text-[11px] font-sans font-medium tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full uppercase">
                    {proj.category}
                  </span>
                  <span className="text-stone-500 text-sm group-hover:text-emerald-400 transition-colors">↗</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">{proj.name}</h3>
                <p className="text-xs text-stone-300 leading-relaxed">{proj.description}</p>
              </div>
              <div className="flex flex-wrap gap-2 pt-3 mt-4 border-t border-white/[0.06] w-full relative z-10">
                {proj.stack.map((tech, idx) => (
                  <span key={idx} className="text-[10px] font-mono text-stone-400 bg-white/[0.04] px-2 py-0.5 rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>

        {/* Banner Inferior (Seu Projeto Aqui) */}
        <div 
          className="portfolio-card-anim w-full rounded-2xl border border-dashed border-emerald-500/40 bg-emerald-950/20 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ padding: '24px 32px' }}
          onMouseEnter={() => handleMouseEnter(5)}
        >
          <div className="text-center md:text-left w-full">
            <h3 className="text-base font-bold text-white mb-1">Próximo Case: Seu Projeto Aqui</h3>
            <p className="text-xs text-stone-300">Desenvolvemos sua plataforma sob medida com engenharia de ponta.</p>
          </div>
          <a 
            href="https://wa.me/5551999019398"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full text-xs font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-500/40 hover:bg-emerald-500/25 whitespace-nowrap transition-all"
          >
            SOLICITAR PROPOSTA NO WHATSAPP →
          </a>
        </div>
      </div>
    </div>
  );
}
