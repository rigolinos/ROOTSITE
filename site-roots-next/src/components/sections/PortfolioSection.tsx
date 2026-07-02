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
      category: 'Dev Tools • IA', 
      stack: ['React', 'Vite', 'TypeScript'], 
      url: 'https://deep-rules.vercel.app/', 
      gradient: 'from-cyan-900/40 to-cyan-950/40', 
      image: '/projects/deep-rules.png',
      description: 'Ferramenta avançada para desenvolvedores, mapeando regras de arquitetura e garantindo governança em codebases complexos.',
      bullets: ['Análise de Código AST', 'Visualização de Dados', 'Interface Futurista']
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
      name: 'Cabeleireiros App', 
      category: 'Marketplace • Prototipagem', 
      stack: ['React', 'Next.js', 'Low-Code'], 
      url: 'https://cabelereiros1.vercel.app/', 
      gradient: 'from-purple-900/40 to-purple-950/40', 
      image: '/projects/cabelereiros.png',
      description: 'Marketplace conectando profissionais de beleza a clientes. Sistema de agendamento, portfólio e avaliações.',
      bullets: ['Prototipagem Rápida e MVP', 'Validação de mercado', 'Integração de agendamentos']
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
            className={`portfolio-card-anim block no-underline group relative overflow-hidden cursor-pointer border-b border-white/[0.05] ${
              i === 4 ? 'md:col-span-2' : ''
            } ${
              i % 2 === 0 && i !== 4 ? 'md:border-r border-white/[0.05]' : ''
            }`}
            onMouseEnter={() => handleMouseEnter(i)}
          >
            {/* Content */}
            <div className="flex flex-col items-center justify-center text-center py-10 px-6 md:p-14 lg:p-20 pointer-events-none bg-[#0A0F0D]/40">
              <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-glow mb-3">{proj.category}</div>
              <h3 className="text-2xl md:text-5xl font-extralight tracking-tight text-white md:group-hover:text-glow transition-colors duration-500">{proj.name}</h3>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
