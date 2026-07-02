'use client';

import { useEffect, useState } from 'react';
import { useLenis } from '@/hooks/useLenis';

const QUICK_LINKS = [
  { id: 0, label: 'Início', icon: '🏠' },
  { id: 3, label: 'Projetos', icon: '🚀' },
  { id: 5, label: 'Serviços', icon: '💼' },
  { id: 8, label: 'Contato', icon: '✉️' },
];

export default function MobileBottomNav() {
  const lenis = useLenis();
  const [activeSection, setActiveSection] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show the bar after a brief delay to let the hero settle
    const timer = setTimeout(() => setVisible(true), 1800);
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
          const isActive = closestLink.id === link.id;
          return (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-300 bg-transparent border-none outline-none cursor-pointer ${
                isActive
                  ? 'text-[#4ADE80] scale-105'
                  : 'text-white/40 hover:text-white/70'
              }`}
              aria-label={link.label}
            >
              <span className="text-lg leading-none">{link.icon}</span>
              <span
                className={`text-[0.6rem] font-semibold tracking-wider uppercase transition-all duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-60'
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
    </nav>
  );
}
