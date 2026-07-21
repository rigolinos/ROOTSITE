'use client';

import React, { useEffect, useState } from 'react';

const SECTIONS = [
  'Root', 'Manifesto', 'Processo', 'Projetos', 'Depoimentos', 
  'Serviços', 'Gestão', 'FAQ', 'Contato'
];

export default function ChapterLabel() {
  const [activeSection, setActiveSection] = useState(0);
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const showLabel = () => {
      setVisible(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setVisible(false);
      }, 2500);
    };

    const handleSectionChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ section: string; index: number }>;
      // Handle both structured detail or fallback if only index is provided differently
      const newIndex = customEvent.detail?.index ?? (customEvent as any).index;
      
      if (typeof newIndex === 'number') {
        setActiveSection(newIndex);
        showLabel();
      }
    };
    
    const handleScroll = () => {
      showLabel();
    };

    window.addEventListener('activeSectionChange', handleSectionChange);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    showLabel();

    return () => {
      window.removeEventListener('activeSectionChange', handleSectionChange);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  const total = SECTIONS.length;
  let start = Math.max(0, activeSection - 2);
  let end = Math.min(total - 1, activeSection + 2);

  if (end - start < 4) {
    if (start === 0) end = Math.min(total - 1, 4);
    if (end === total - 1) start = Math.max(0, total - 5);
  }

  const dots = [];
  for (let i = start; i <= end; i++) {
    dots.push(i);
  }

  const sectionName = SECTIONS[activeSection] || 'Root';
  const displayNum = String(activeSection + 1).padStart(2, '0');

  return (
    <div 
      className={`fixed top-20 left-6 z-[170] md:hidden transition-opacity duration-300 flex items-center gap-3 bg-transparent ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex gap-1.5 items-center">
        {dots.map((idx) => (
          <div 
            key={idx}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              idx === activeSection ? 'bg-[#4ADE80]' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
      <span className="uppercase tracking-widest text-xs font-semibold text-white">
        <span className="text-[#4ADE80]">{displayNum}</span> · {sectionName}
      </span>
    </div>
  );
}
