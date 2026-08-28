'use client';

import React, { useEffect, useState } from 'react';

const SECTIONS = [
  'Root', 'Manifesto', 'Processo', 'Projetos', 'Depoimentos', 
  'Serviços', 'Gestão', 'FAQ', 'Contato'
];

export default function NextSectionHint() {
  const [activeSection, setActiveSection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleSectionChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ section: string; index: number }>;
      const newIndex = customEvent.detail?.index ?? (customEvent as any).index;

      if (typeof newIndex === 'number') {
        setIsTransitioning(true);
        setActiveSection(newIndex);
        
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          setIsTransitioning(false);
        }, 800);
      }
    };

    window.addEventListener('activeSectionChange', handleSectionChange);
    return () => {
      window.removeEventListener('activeSectionChange', handleSectionChange);
      clearTimeout(timeout);
    };
  }, []);

  if (activeSection >= SECTIONS.length - 1) return null;

  const nextSectionName = SECTIONS[activeSection + 1];

  return (
    <div 
      className={`fixed bottom-14 left-1/2 -translate-x-1/2 z-[15] hidden md:flex flex-col items-center gap-1 transition-opacity duration-500 ${
        isTransitioning ? 'opacity-0' : 'opacity-20'
      }`}
    >
      <div className="text-white/80 text-[10px] animate-bob">▼</div>
      <span className="text-xs uppercase tracking-widest text-white">
        Próximo: {nextSectionName}
      </span>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bob {
          0%, 100% { transform: translateY(-3px); }
          50% { transform: translateY(3px); }
        }
        .animate-bob {
          animation: bob 2s infinite ease-in-out;
        }
      `}} />
    </div>
  );
}
