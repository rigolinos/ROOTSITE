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

  const handleMouseMoveCard = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--shine-x', `${x}px`);
    e.currentTarget.style.setProperty('--shine-y', `${y}px`);
    
    // Slight parallax on inner content
    const inner = e.currentTarget.querySelector('.inner-content') as HTMLElement;
    if (inner) {
      const moveX = (x - rect.width / 2) * 0.05;
      const moveY = (y - rect.height / 2) * 0.05;
      inner.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
  };

  const handleMouseEnter = (i: number) => {
    setActiveProject(i);
    const allCards = document.querySelectorAll('.portfolio-card-anim');
    allCards.forEach((c, idx) => {
      if (idx === i) {
        gsap.to(c, { scale: 1.05, duration: 0.6, ease: 'expo.out' });
        const meta = c.querySelector('.meta-stack');
        if(meta) gsap.to(meta, { y: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.2)' });
      } else {
        const diff = idx - i;
        const pushX = diff > 0 ? 10 : diff < 0 ? -10 : 0;
        gsap.to(c, { scale: 0.95, x: pushX, opacity: 0.3, duration: 0.6, ease: 'expo.out' });
      }
    });

    if (portalRef.current) {
      const yOffset = i < 3 ? 10 : -110; // Top 3 open downwards, bottom 2 open upwards
      gsap.set(portalRef.current, { yPercent: yOffset });
      gsap.to(portalRef.current, { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.5, ease: 'power3.out' });
    }

    if (typeof window !== 'undefined') {
      const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#06b6d4'];
      window.dispatchEvent(new CustomEvent('root-hover', { detail: { segmentId: `project-${i}`, color: colors[i % colors.length] } }));
    }
  };

  const handleMouseLeaveGrid = () => {
    const allCards = document.querySelectorAll('.portfolio-card-anim');
    gsap.to(allCards, { scale: 1, x: 0, opacity: 1, zIndex: 1, duration: 0.6, ease: 'expo.out' });
    const allMeta = document.querySelectorAll('.meta-stack');
    gsap.to(allMeta, { y: 20, opacity: 0, duration: 0.4, ease: 'power2.out' });

    if (portalRef.current) {
      gsap.to(portalRef.current, { scale: 0.8, opacity: 0, filter: 'blur(10px)', duration: 0.4, ease: 'power3.out' });
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('root-hover', { detail: { segmentId: null } }));
    }
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
      <h2 className="section-title text-glow text-center mb-16 uppercase tracking-widest text-sm md:text-base">
        Projetos Selecionados
      </h2>
      
      {/* Floating Preview Portal - Rendered at root body via createPortal */}
      {mounted && typeof document !== 'undefined' && createPortal(
        <div 
          ref={portalRef}
          className="fixed top-0 left-0 w-[340px] pointer-events-none z-[99999] flex flex-col backdrop-blur-xl border border-white/10 bg-zinc-950/80 rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] opacity-0"
        >
          {/* Media Frame */}
          <div className="h-[200px] w-full relative overflow-hidden bg-zinc-900">
             <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent mix-blend-overlay z-10" />
             <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent z-10" />
             
             {projects[activeProject]?.image ? (
               <img 
                 src={projects[activeProject].image} 
                 alt={projects[activeProject].name}
                 className="absolute inset-0 w-full h-full object-cover"
                 style={{ filter: 'saturate(0.85) contrast(1.1)' }}
               />
             ) : (
               <div className="absolute inset-0 flex items-center justify-center bg-[#0d1610]" style={{ filter: 'saturate(0.8)' }}>
                 <span className="text-white/10 font-black text-4xl uppercase tracking-tighter mix-blend-overlay text-center px-4 leading-none">
                   {projects[activeProject]?.name}
                 </span>
                 {/* Decorative grid */}
                 <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
               </div>
             )}
          </div>
          {/* Metadata Area */}
          <div className="p-6 flex flex-col gap-4 relative z-20">
             <div>
               <div className="text-[10px] font-bold text-glow uppercase tracking-[0.2em] mb-1.5">{projects[activeProject]?.category}</div>
               <h4 className="text-white font-bold text-xl tracking-wide">{projects[activeProject]?.name}</h4>
             </div>
             
             {projects[activeProject]?.description && (
               <p className="text-white/60 text-xs leading-relaxed">
                 {projects[activeProject]?.description}
               </p>
             )}
             
             {projects[activeProject]?.bullets && (
               <ul className="flex flex-col gap-1 mt-1">
                 {projects[activeProject].bullets.map((bullet, idx) => (
                   <li key={idx} className="text-white/80 text-[11px] flex items-center gap-2">
                     <span className="w-1 h-1 rounded-full bg-glow/50" />
                     {bullet}
                   </li>
                 ))}
               </ul>
             )}

             <div className="flex flex-wrap gap-2 mt-2 pt-4 border-t border-white/5">
               {projects[activeProject]?.stack.map((t, j) => (
                  <span key={j} className="text-[9px] uppercase font-bold tracking-wider px-2 py-1.5 rounded-md border border-white/10 bg-white/5 text-white/70">
                    {t}
                  </span>
               ))}
             </div>
          </div>
        </div>,
        document.body
      )}

      <div className="portfolio-grid mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 border-y border-white/[0.05]" onMouseLeave={handleMouseLeaveGrid}>
        {/* Animated Cross Lines (Horizontal & Vertical) */}
        <div className="cross-line-h hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-glow/20 pointer-events-none scale-x-0 origin-center z-20" />
        <div className="cross-line-v hidden md:block absolute top-0 left-1/2 w-[1px] h-full bg-glow/20 pointer-events-none scale-y-0 origin-center z-20" />

        {projects.map((proj, i) => (
          <a
            key={i}
            href={proj.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`portfolio-card-anim w-full p-10 md:p-14 lg:p-20 block no-underline group relative cursor-none flex flex-col justify-center items-center text-center ${
              i === 4 ? 'md:col-span-2 border-t border-white/[0.05] md:border-t-0' : ''
            } ${
              i % 2 === 0 && i !== 4 ? 'md:border-r border-white/[0.05]' : ''
            } ${
              i < 4 ? 'border-b border-white/[0.05] md:border-b' : ''
            }`}
            onMouseMove={handleMouseMoveCard}
            onMouseEnter={() => handleMouseEnter(i)}
          >
            <div className="inner-content transition-transform duration-500 ease-out will-change-transform flex flex-col items-center justify-center max-w-lg mx-auto">
              <div className="text-[10px] font-mono text-white/20 mb-8 tracking-widest">0{i + 1} // {i === 4 ? 'HIGHLIGHT' : 'PROJECT'}</div>
              
              <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-glow mb-5">{proj.category}</div>
              <h3 className="text-4xl md:text-5xl font-extralight tracking-tight text-white mb-8 group-hover:text-glow transition-colors duration-500">{proj.name}</h3>
              
              <div className="meta-stack flex flex-wrap justify-center gap-3 mt-2 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                {proj.stack.map((tech, j) => (
                  <span key={j} className="text-[9px] uppercase tracking-widest px-3 py-1 rounded-full border border-white/10 text-white/70">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
