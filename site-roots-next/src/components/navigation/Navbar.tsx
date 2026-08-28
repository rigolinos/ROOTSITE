'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from '@/lib/gsap-register';
import { useLenis } from '@/hooks/useLenis';
import { MOTION } from '@/lib/animations';

const NAV_LINKS = [
  { id: 0, label: 'Root' },
  { id: 1, label: 'Manifesto' },
  { id: 2, label: 'Processo' },
  { id: 3, label: 'Projetos' },
  { id: 4, label: 'Depoimentos' },
  { id: 5, label: 'Serviços' },
  { id: 6, label: 'Gestão' },
  { id: 7, label: 'FAQ' },
  { id: 8, label: 'Contato' },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const [visible, setVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Initial entrance (after hero animation ~3s)
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
      if (navRef.current) {
        gsap.fromTo(
          navRef.current,
          { y: -60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: MOTION.duration.min,
            ease: MOTION.ease.fade,
          }
        );
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (sectionIndex: number) => {
    if (!lenis) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (sectionIndex + 0.5) / 9; // middle of that section
    const targetScroll = progress * maxScroll;
    
    if (isMobileMenuOpen) {
      toggleMobileMenu();
      setTimeout(() => {
        lenis.scrollTo(targetScroll, { duration: 1.8 });
      }, 600);
    } else {
      lenis.scrollTo(targetScroll, { duration: 1.8 });
    }
  };

  const toggleMobileMenu = () => {
    if (!isMobileMenuOpen) {
      setIsMobileMenuOpen(true);
      gsap.to(drawerRef.current, {
        y: '0%',
        duration: 0.6,
        ease: 'power3.inOut',
      });
      gsap.fromTo(
        linksRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.05,
          ease: 'back.out(1.2)',
          delay: 0.3,
        }
      );
    } else {
      gsap.to(linksRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.3,
        stagger: 0.03,
        ease: 'power2.in',
      });
      gsap.to(drawerRef.current, {
        y: '-100%',
        duration: 0.6,
        ease: 'power3.inOut',
        delay: 0.2,
        onComplete: () => setIsMobileMenuOpen(false),
      });
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[200] pointer-events-none opacity-0 border-b border-white/[0.04] bg-[#0A0F0D]/70 backdrop-blur-xl transition-all duration-500"
        style={{ transform: 'translateY(-60px)' }}
      >
        <div className="max-w-[1400px] mx-auto w-full py-5 flex items-center justify-between pointer-events-auto px-6 md:px-10">
          
          {/* Logo (Left) */}
          <button
            onClick={() => scrollToSection(0)}
            className="w-32 text-left text-white font-bold tracking-[0.25em] cursor-pointer hover:text-glow transition-all duration-300 select-none bg-transparent border-none outline-none"
            style={{ fontSize: '0.85rem' }}
          >
            ROOT CODE
          </button>

          {/* Desktop Navigation Menu (Center) */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-10">
            {['Processo', 'Projetos', 'Serviços'].map((item, idx) => (
              <button
                key={item}
                onClick={() => scrollToSection([2, 3, 5][idx])}
                className="text-white/60 hover:text-white text-[0.7rem] font-medium tracking-widest uppercase transition-all duration-300 cursor-pointer bg-transparent border-none outline-none relative group"
                style={{ letterSpacing: '0.15em' }}
              >
                {item}
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-glow transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* Contact CTA (Right) */}
          <div className="hidden md:flex w-32 justify-end">
            <button
              onClick={() => scrollToSection(8)}
              className="px-5 py-2 rounded-full border border-emerald-500/20 hover:border-emerald-400/50 bg-emerald-500/5 hover:bg-emerald-400/10 text-emerald-400 text-[0.65rem] font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_0_15px_rgba(74,222,128,0.05)] hover:shadow-[0_0_20px_rgba(74,222,128,0.15)] outline-none"
            >
              Contato
            </button>
          </div>

          {/* Mobile Leaf Menu Trigger */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden w-11 h-11 flex items-center justify-center bg-transparent border-none outline-none cursor-pointer z-[201] relative translate-y-1.5"
            aria-label="Toggle Menu"
          >
            <img 
              src="/logos/root-leaf.svg" 
              alt="Menu" 
              className={`absolute inset-0 w-11 h-11 invert transition-all duration-700 ease-out ${isMobileMenuOpen ? 'rotate-[45deg] opacity-0 scale-110' : 'rotate-0 opacity-90 scale-100'}`} 
            />
            <span 
              className={`absolute text-4xl text-white font-light transition-all duration-500 ease-out ${isMobileMenuOpen ? 'opacity-90 rotate-0 scale-100 delay-300' : 'opacity-0 -rotate-45 scale-50'}`}
            >
              ✕
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Fullscreen Drawer */}
      <div
        ref={drawerRef}
        className="fixed inset-0 z-[150] bg-[#0A0F0D]/95 backdrop-blur-xl flex flex-col items-center justify-center pointer-events-auto"
        style={{ transform: 'translateY(-100%)' }}
      >
        <div className="flex flex-col items-center gap-6 w-full px-6">
          {NAV_LINKS.map((link, i) => (
            <button
              key={link.id}
              ref={(el) => { linksRef.current[i] = el; }}
              onClick={() => scrollToSection(link.id)}
              className="text-2xl font-light tracking-widest text-white/70 hover:text-glow transition-colors uppercase py-2"
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
