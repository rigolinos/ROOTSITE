'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from '@/lib/gsap-register';
import { useLenis } from '@/hooks/useLenis';
import { MOTION } from '@/lib/animations';

/**
 * Minimal Navbar — hides on scroll down, shows on scroll up.
 * Appears only after preloader completes.
 */
export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

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

  // Listen to the custom activeSectionChange event
  useEffect(() => {
    const handleSectionChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ index: number }>;
      setActiveSection(customEvent.detail.index);
    };

    window.addEventListener('activeSectionChange', handleSectionChange);
    return () => {
      window.removeEventListener('activeSectionChange', handleSectionChange);
    };
  }, []);

  // Control visibility of Navbar based on activeSection (0 = Hero, 7 = Contato)
  useEffect(() => {
    if (!visible) return; // wait until preloader/initial entry is done

    const nav = navRef.current;
    if (!nav) return;

    if (activeSection === 0 || activeSection === 7) {
      // Show Navbar
      gsap.to(nav, {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: MOTION.ease.fade,
      });
    } else {
      // Hide Navbar
      gsap.to(nav, {
        y: -60,
        opacity: 0,
        duration: 0.4,
        ease: MOTION.ease.fade,
      });
    }
  }, [activeSection, visible]);

  const scrollToSection = (sectionIndex: number) => {
    if (!lenis) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (sectionIndex + 0.5) / 8; // middle of that section
    const targetScroll = progress * maxScroll;
    lenis.scrollTo(targetScroll, {
      duration: 1.8,
    });
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-[100] pointer-events-none opacity-0"
      style={{ transform: 'translateY(-60px)' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between pointer-events-auto">
        <button
          onClick={() => scrollToSection(0)}
          className="text-white font-bold tracking-widest cursor-pointer hover:text-glow transition-all duration-300 select-none bg-transparent border-none outline-none"
          style={{ fontSize: '0.85rem', letterSpacing: '0.25em' }}
        >
          ROOT CODE
        </button>

        {/* Minimalist Navigation Menu */}
        <div className="flex items-center gap-6 md:gap-10">
          <button
            onClick={() => scrollToSection(1)} // Section 1 (Semente) = Origem
            className="text-sage hover:text-glow text-xs font-medium tracking-wider transition-all duration-300 relative py-1 group cursor-pointer bg-transparent border-none outline-none"
            style={{ letterSpacing: '0.15em' }}
          >
            Origem
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-glow transition-all duration-300 group-hover:w-full" />
          </button>
          <button
            onClick={() => scrollToSection(3)} // Section 3 (Planos) = Serviços
            className="text-sage hover:text-glow text-xs font-medium tracking-wider transition-all duration-300 relative py-1 group cursor-pointer bg-transparent border-none outline-none"
            style={{ letterSpacing: '0.15em' }}
          >
            Serviços
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-glow transition-all duration-300 group-hover:w-full" />
          </button>
          <button
            onClick={() => scrollToSection(7)} // Section 7 (CTA) = Contato
            className="text-sage hover:text-glow text-xs font-medium tracking-wider transition-all duration-300 relative py-1 group cursor-pointer bg-transparent border-none outline-none"
            style={{ letterSpacing: '0.15em' }}
          >
            Contato
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-glow transition-all duration-300 group-hover:w-full" />
          </button>
        </div>

        <span
          className="text-sage text-xs font-medium tracking-wider hidden lg:block select-none"
          style={{ letterSpacing: '0.15em' }}
        >
          Eficiência Silenciosa
        </span>
      </div>
    </nav>
  );
}
