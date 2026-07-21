'use client';

import { useEffect, useState } from 'react';
import { useLenis } from '@/hooks/useLenis';

const LeafIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 14 6c3 0 7 2 7 2s-2 4-2 7a7 7 0 0 1-7 7z" />
    <path d="M11 20c-5-2-7-6-7-10s4-7 4-7 1 3 1 7c0 4 2 8 2 10z" />
  </svg>
);

const GridIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);

const HexagonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
  </svg>
);

const ArrowUpRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

const QUICK_LINKS = [
  { id: 0, label: 'Root', icon: <LeafIcon /> },
  { id: 3, label: 'Projetos', icon: <GridIcon /> },
  { id: 5, label: 'Serviços', icon: <HexagonIcon /> },
  { id: 8, label: 'Contato', icon: <ArrowUpRightIcon /> },
];

export default function MobileBottomNav() {
  const lenis = useLenis();
  const [activeSection, setActiveSection] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show the bar after a brief delay to let the hero settle
    const timer = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleSectionChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ index: number }>;
      setActiveSection(customEvent.detail.index);
    };
    window.addEventListener('activeSectionChange', handleSectionChange);
    return () => window.removeEventListener('activeSectionChange', handleSectionChange);
  }, []);

  const scrollToSection = (sectionIndex: number) => {
    if (!lenis) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (sectionIndex + 0.5) / 9;
    const targetScroll = progress * maxScroll;
    lenis.scrollTo(targetScroll, { duration: 1.8 });
  };

  // Find the closest quick link to highlight
  const closestLink = QUICK_LINKS.reduce((prev, curr) =>
    Math.abs(curr.id - activeSection) < Math.abs(prev.id - activeSection) ? curr : prev
  );

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-[180] md:hidden transition-all duration-700 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
    >
      {/* Gradient fade above the bar */}
      <div className="h-8 bg-gradient-to-t from-[#0A0F0D]/90 to-transparent pointer-events-none" />

      {/* Navigation pill bar */}
      <div
        className="flex items-center justify-around px-4 py-3 mx-4 mb-4 rounded-2xl border border-white/[0.08]"
        style={{
          background: 'rgba(10, 15, 13, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 -4px 30px rgba(0,0,0,0.4), 0 0 40px rgba(74,222,128,0.05)',
        }}
      >
        {QUICK_LINKS.map((link) => {
          const isContato = link.id === 8;
          const isActive = closestLink.id === link.id && !isContato;
          
          return (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className={`relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-300 border-none outline-none cursor-pointer ${
                isContato 
                  ? 'text-[#4ADE80] scale-110 bg-[#4ADE80]/15' 
                  : isActive
                  ? 'text-[#4ADE80] scale-105 bg-transparent'
                  : 'text-white/40 hover:text-white/70 bg-transparent'
              }`}
              style={
                isContato
                  ? {
                      boxShadow: '0 0 15px rgba(74, 222, 128, 0.3), inset 0 0 10px rgba(74, 222, 128, 0.1)',
                      animation: 'pulseGlow 2s infinite alternate'
                    }
                  : {}
              }
              aria-label={link.label}
            >
              <span className="flex items-center justify-center leading-none">
                {link.icon}
              </span>
              <span
                className={`text-[0.6rem] font-semibold tracking-wider uppercase transition-all duration-300 ${
                  isActive || isContato ? 'opacity-100' : 'opacity-60'
                }`}
              >
                {link.label}
              </span>
              {isActive && (
                <span
                  className="absolute -bottom-0.5 w-5 h-0.5 rounded-full bg-[#4ADE80]"
                  style={{ boxShadow: '0 0 8px rgba(74,222,128,0.5)' }}
                />
              )}
            </button>
          );
        })}
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 10px rgba(74, 222, 128, 0.2), inset 0 0 5px rgba(74, 222, 128, 0.1); }
          100% { box-shadow: 0 0 20px rgba(74, 222, 128, 0.4), inset 0 0 12px rgba(74, 222, 128, 0.2); }
        }
      `}} />
    </nav>
  );
}
