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
    }, 3200);

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
        className="fixed top-0 left-0 right-0 z-[200] pointer-events-none opacity-0"
        style={{ transform: 'translateY(-60px)' }}
      >
        <div className="max-w-7xl mx-auto w-full pt-8 md:pt-10 pb-5 flex items-center justify-between pointer-events-auto" style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
          <button
            onClick={() => scrollToSection(0)}
            className="text-white font-bold tracking-widest cursor-pointer hover:text-glow transition-all duration-300 select-none bg-transparent border-none outline-none"
            style={{ fontSize: '0.85rem', letterSpacing: '0.25em' }}
          >
            ROOT CODE
          </button>

          {/* Desktop Navigation Menu */}
          <div className="hidden md:flex items-center gap-6 lg:gap-10">
            <button
              onClick={() => scrollToSection(2)}
              className="text-sage hover:text-glow text-xs font-medium tracking-wider transition-all duration-300 relative py-1 group cursor-pointer bg-transparent border-none outline-none"
              style={{ letterSpacing: '0.15em' }}
            >
              Processo
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-glow transition-all duration-300 group-hover:w-full" />
            </button>
            <button
              onClick={() => scrollToSection(3)}
              className="text-sage hover:text-glow text-xs font-medium tracking-wider transition-all duration-300 relative py-1 group cursor-pointer bg-transparent border-none outline-none"
              style={{ letterSpacing: '0.15em' }}
            >
              Projetos
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-glow transition-all duration-300 group-hover:w-full" />
            </button>
            <button
              onClick={() => scrollToSection(5)}
              className="text-sage hover:text-glow text-xs font-medium tracking-wider transition-all duration-300 relative py-1 group cursor-pointer bg-transparent border-none outline-none"
              style={{ letterSpacing: '0.15em' }}
            >
              Serviços
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-glow transition-all duration-300 group-hover:w-full" />
            </button>
            <button
              onClick={() => scrollToSection(8)}
              className="text-sage hover:text-glow text-xs font-medium tracking-wider transition-all duration-300 relative py-1 group cursor-pointer bg-transparent border-none outline-none"
              style={{ letterSpacing: '0.15em' }}
            >
              Contato
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-glow transition-all duration-300 group-hover:w-full" />
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
