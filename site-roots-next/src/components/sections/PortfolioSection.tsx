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
      name: 'Cabeleireiros App', 
      category: 'Marketplace • Prototipagem', 
      stack: ['React', 'Next.js', 'Low-Code'], 
      url: 'https://cabelereiros1.vercel.app/', 
      gradient: 'from-purple-900/40 to-purple-950/40', 
      image: '/projects/cabelereiros.png',
      description: 'Marketplace conectando profissionais de beleza a clientes. Sistema de agendamento, portfólio e avaliações.',
      bullets: ['Prototipagem Rápida e MVP', 'Validação de mercado', 'Integração de agendamentos']
    },
    { 
      name: 'Pet Connect', 
      category: 'Social Impact • AI Assisted', 
      stack: ['React 19', 'Tailwind', 'Node.js'], 
      url: 'https://petsupport.vercel.app/', 
      gradient: 'from-blue-900/40 to-blue-950/40', 
      image: '/projects/petconnect.png',
      description: 'Sistema interno inteligente para gestão de doações e logística de ONGs de animais, conectando doadores a necessidades urgentes.',
      bullets: ['Desenvolvedor Full-Cycle', 'Automações de Conexão', 'Dashboards de Dados']
    },
    { 
      name: 'Riff Sports', 
      category: 'Sports Tech • SaaS', 
      stack: ['Next.js', 'Tailwind CSS', 'Framer Motion'], 
      url: 'https://riffsports.vercel.app/', 
      gradient: 'from-green-900/40 to-green-950/40', 
      image: '/projects/riff-sports.png',
      description: 'Plataforma SaaS focada em infraestrutura e gestão de ecossistemas esportivos. Solução completa para agendamentos e gestão das quadras.',
      bullets: ['Website Institucional', 'Alta Performance & SEO', 'Foco em Conversão']
    },
    { 
      name: 'Mentes que Inspiram', 
      category: 'Entretenimento • Mídia', 
      stack: ['GSAP', 'Locomotive', 'Vanilla JS'], 
      url: 'https://mentesqueinspiram.com/', 
      gradient: 'from-amber-900/40 to-amber-950/40', 
      image: '/projects/mentes-que-inspiram.png',
      description: 'Plataforma digital imersiva para talk show. Foco em storytelling visual e transições fluidas para engajar a audiência.',
      bullets: ['Experiência Cinematográfica', 'Animações Complexas', 'Design Interativo']
    },
    { 
      name: 'Deep Rules', 
      category: 'Dev Tools • IA', 
      stack: ['React', 'Vite', 'TypeScript'], 
      url: 'https://deep-rules.vercel.app/', 
      gradient: 'from-cyan-900/40 to-cyan-950/40', 
      image: '/projects/deep-rules.png',
      description: 'Ferramenta avançada para desenvolvedores, mapeando regras de arquitetura e garantindo governança em codebases complexos.',
      bullets: ['Análise de Código AST', 'Visualização de Dados', 'Interface Futurista']
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
      className="section-content w-full max-w-[1200px] opacity-0" 
      ref={containerRef} 
    >
      <h2 
        className="section-title text-glow text-center mb-16 uppercase tracking-widest"
        style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}
      >
        Projetos Selecionados
      </h2>
      
      {/* Portal Removido */}

      <div className="portfolio-grid mx-auto relative z-10 flex md:grid md:grid-cols-2 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:border-y border-white/[0.05] pb-4 md:pb-0" onMouseLeave={handleMouseLeaveGrid}>
        {/* Animated Cross Lines (Horizontal & Vertical) */}
        <div className="cross-line-h hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-glow/20 pointer-events-none scale-x-0 origin-center z-20" />
        <div className="cross-line-v hidden md:block absolute top-0 left-1/2 w-[1px] h-full bg-glow/20 pointer-events-none scale-y-0 origin-center z-20" />

        {projects.map((proj, i) => (
          <a
            key={i}
            href={proj.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`portfolio-card-anim bg-[#0A0F0D]/50 backdrop-blur-md w-[85vw] md:w-full flex-shrink-0 snap-center py-8 px-4 md:p-14 lg:p-20 block no-underline group relative flex flex-col justify-center items-center text-center cursor-pointer ${
              i === 4 ? 'md:col-span-2 md:border-t-0' : ''
            } ${
              i % 2 === 0 && i !== 4 ? 'md:border-r border-white/[0.05]' : ''
            } ${
              i < 4 ? 'md:border-b border-white/[0.05] border-r border-white/[0.05]' : ''
            }`}
          >
            <div className="inner-content flex flex-col items-center justify-center max-w-lg mx-auto pointer-events-none">
              <div className="text-[10px] font-mono text-white/20 mb-4 md:mb-8 tracking-widest">0{i + 1} // {i === 4 ? 'HIGHLIGHT' : 'PROJECT'}</div>
              
              <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-glow mb-3 md:mb-5">{proj.category}</div>
              <h3 className="text-3xl md:text-5xl font-extralight tracking-tight text-white mb-4 md:mb-8 md:group-hover:text-glow transition-colors duration-500">{proj.name}</h3>
              
              <div className="meta-stack flex flex-wrap justify-center gap-2 md:gap-3 mt-2 opacity-100 md:opacity-60 md:group-hover:opacity-100 transition-opacity duration-500">
                {proj.stack.map((tech, j) => (
                  <span key={j} className="text-[9px] uppercase tracking-widest px-2 py-1 md:px-3 rounded-full border border-white/10 text-white/70">
                    {tech}
                  </span>
                ))}
              </div>
              <p className="text-white/60 text-xs mt-4 md:hidden block max-w-sm mx-auto leading-relaxed text-center px-2">
                {proj.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
