'use client';

import { useEffect, useRef, useState } from 'react';
import { useLenis } from '@/hooks/useLenis';

const SECTIONS = [
  { id: 0, label: 'Root' },
  { id: 1, label: 'Manifesto' },
  { id: 2, label: 'Processo' },
  { id: 3, label: 'Serviços' },
  { id: 4, label: 'Portfólio' },
  { id: 5, label: 'Depoimentos' },
  { id: 6, label: 'Gestão' },
  { id: 7, label: 'Métricas' },
  { id: 8, label: 'FAQ' },
  { id: 9, label: 'Contato' },
];

export default function ScrollProgressLine() {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollPercent, setScrollPercent] = useState(0);
  const fillRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  // Listen to the global canvas section changes for perfect sync
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

  // Listen to Lenis scroll for smooth percentage and vertical line fill updates
  useEffect(() => {
    if (!lenis) return;

    const handleScroll = () => {
      const progress = lenis.progress || 0;
      setScrollPercent(Math.round(progress * 100));
      if (fillRef.current) {
        fillRef.current.style.height = `${progress * 100}%`;
      }
    };

    lenis.on('scroll', handleScroll);
    handleScroll(); // Initial run

    return () => {
      lenis.off('scroll', handleScroll);
    };
  }, [lenis]);

  const scrollToSection = (index: number) => {
    if (!lenis) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (index + 0.5) / 10; // target the middle of the section for perfect canvas state
    const targetScroll = progress * maxScroll;
    lenis.scrollTo(targetScroll, {
      duration: 1.5,
    });
  };

  return (
    <div 
      style={{
        position: 'fixed',
        left: '30px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        userSelect: 'none',
        pointerEvents: 'auto',
      }}
    >
      
      {/* Scroll Percentage display at the top */}
      <div 
        className="text-glow"
        style={{ 
          fontFamily: 'monospace',
          fontSize: '10px',
          letterSpacing: '0.2em',
          color: '#4ADE80',
          marginBottom: '20px',
          userSelect: 'none',
          fontVariantNumeric: 'tabular-nums'
        }}
      >
        {String(scrollPercent).padStart(3, '0')}%
      </div>

      {/* Vertical Navigation Track & Dots */}
      <div 
        style={{ 
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '8px 0',
          height: '240px',
          width: '20px'
        }}
      >
        
        {/* Background Track Line */}
        <div 
          style={{ 
            width: '2px', 
            height: '240px', 
            backgroundColor: 'rgba(255, 255, 255, 0.1)', 
            position: 'relative', 
            borderRadius: '999px', 
            overflow: 'hidden'
          }}
        >
          {/* Green Progress Fill */}
          <div 
            ref={fillRef}
            className="text-glow"
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              backgroundColor: '#4ADE80',
              transformOrigin: 'top',
              transition: 'height 150ms ease-out',
              height: '0%',
              boxShadow: '0 0 10px rgba(74, 222, 128, 0.5), 0 0 20px rgba(74, 222, 128, 0.2)'
            }}
          />
        </div>

        {/* Floating Dots overlayed on the line */}
        <div 
          style={{ 
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'between',
            padding: '4px 0',
            pointerEvents: 'none',
            height: '100%'
          }}
        >
          {SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <div 
                key={sec.id} 
                className="group"
                onClick={() => scrollToSection(sec.id)}
                style={{ 
                  position: 'absolute',
                  top: `${(sec.id / (SECTIONS.length - 1)) * 100}%`,
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: '24px', 
                  width: '24px',
                  cursor: 'pointer',
                  pointerEvents: 'auto'
                }}
              >
                {/* Clickable Dot */}
                <div 
                  style={{
                    width: isActive ? '10px' : '6px',
                    height: isActive ? '10px' : '6px',
                    borderRadius: '50%',
                    backgroundColor: isActive ? '#4ADE80' : 'transparent',
                    border: isActive ? '2px solid #4ADE80' : '2px solid rgba(152, 169, 154, 0.5)',
                    boxShadow: isActive ? '0 0 12px #4ADE80, 0 0 20px rgba(74, 222, 128, 0.6)' : 'none',
                    transform: isActive ? 'scale(1.2)' : 'scale(1)',
                    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  }}
                />

                {/* Sleek active text label */}
                <span 
                  className="text-glow"
                  style={{
                    position: 'absolute',
                    left: '32px',
                    fontSize: '9px',
                    fontWeight: 600,
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    color: isActive ? '#FFFFFF' : '#98A99A',
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? 'translateX(0px)' : 'translateX(-8px)',
                    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  }}
                >
                  {sec.label}
                </span>

                {/* Sleek hover text label (when not active) */}
                {!isActive && (
                  <span 
                    style={{
                      position: 'absolute',
                      left: '32px',
                      fontSize: '9px',
                      fontWeight: 600,
                      letterSpacing: '0.25em',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      color: '#4ADE80',
                      opacity: 0,
                      transform: 'translateX(-8px)',
                      transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    }}
                    className="group-hover-label"
                  >
                    {sec.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
