'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap-register';
import MagneticButton from '@/components/effects/MagneticButton';
import HeroTypography from '@/components/hero/HeroTypography';
import ManifestoSection from '@/components/sections/ManifestoSection';
import ProcessoSection from '@/components/sections/ProcessoSection';
import PortfolioSection from '@/components/sections/PortfolioSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import FAQSection from '@/components/sections/FAQSection';

// ── 3D Tilt Card Component ────────────────────────
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  isFeatured?: boolean;
}

function TiltCard({ children, className, isFeatured }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (centerY - y) / 12; // Moderate rotation max
    const rotateY = (x - centerX) / 12;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
    card.style.transition = 'none';

    if (typeof window !== 'undefined') {
      const plan = card.getAttribute('data-plan');
      if (plan) {
        window.dispatchEvent(new CustomEvent('root-hover', { detail: { segmentId: plan } }));
      }
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    card.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

    if (typeof window !== 'undefined') {
      const plan = card.getAttribute('data-plan');
      if (plan) {
        window.dispatchEvent(new CustomEvent('root-hover', { detail: { segmentId: null } }));
      }
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${className} ${isFeatured ? 'featured' : ''}`}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-glow/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
        style={{ transform: 'translateZ(-10px)' }}
      />
      {children}
    </div>
  );
}

// ── Stat Counter Component ────────────────────────
interface StatItemProps {
  target: number | string;
  label: React.ReactNode;
  isActive: boolean;
}

function StatItem({ target, label, isActive }: StatItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isActive || hasAnimated.current || !containerRef.current || !numberRef.current) return;
    hasAnimated.current = true;

    let targetNum = 0;
    if (typeof target === 'number') {
      targetNum = target;
    } else {
      targetNum = parseInt(target, 10);
    }
    if (isNaN(targetNum)) return;

    // Scale bounce (Spring Physics)
    gsap.fromTo(containerRef.current,
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.8, ease: 'elastic.out(1, 0.4)' }
    );

    // Number counting
    const counter = { val: 0 };
    const suffix = typeof target === 'string' && target.includes('%') ? '%' : typeof target === 'string' && target.includes('/') ? '/7' : '';
    
    gsap.to(counter, {
      val: targetNum,
      duration: 2.5,
      ease: 'power3.out',
      onUpdate: () => {
        if (numberRef.current) {
          numberRef.current.textContent = Math.floor(counter.val) + suffix;
        }
      }
    });

    // Local particles agitation
    const particles = containerRef.current.querySelectorAll('.local-particle');
    gsap.to(particles, {
      x: 'random(-50, 50)',
      y: 'random(-50, 50)',
      opacity: 0,
      scale: 'random(0.5, 2)',
      duration: 'random(1.5, 2.5)',
      ease: 'power2.out'
    });

  }, [isActive, target]);

  // Generate 8 tiny dots for particle effect
  const particles = Array.from({ length: 8 });

  return (
    <div className="stat-item relative" ref={containerRef} style={{ opacity: 0 }}>
      {particles.map((_, i) => (
        <div 
          key={i} 
          className="local-particle absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-glow rounded-full pointer-events-none" 
          style={{ transform: 'translate(-50%, -50%)', opacity: 0.6 }}
        />
      ))}
      <div className="stat-number tabular-nums relative z-10" ref={numberRef}>
        0
      </div>
      <div className="stat-label relative z-10">
        {label}
      </div>
    </div>
  );
}

// ── Main SectionContent Component ──────────────────
export default function SectionContent() {
  const [activeSection, setActiveSection] = useState(0);

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

  return (
    <div id="sections-wrapper" className="fixed inset-0 z-10 pointer-events-none">
      
      {/* Section 0: Hero */}
      <div className={`section-overlay ${activeSection === 0 ? 'active' : ''}`} id="section-hero" data-section="0">
        <HeroTypography />
        <div className="scroll-indicator">
          <span>Scroll</span>
          <div className="scroll-arrow" />
        </div>
      </div>

      {/* Section 1: Manifesto */}
      <div className={`section-overlay ${activeSection === 1 ? 'active' : ''}`} id="section-manifesto" data-section="1">
        <ManifestoSection isActive={activeSection === 1} />
      </div>

      {/* Section 2: O Processo */}
      <div className={`section-overlay ${activeSection === 2 ? 'active' : ''}`} id="section-processo" data-section="2">
        <ProcessoSection isActive={activeSection === 2} />
      </div>

      {/* Section 3: Serviços (Planos) */}
      <div className={`section-overlay ${activeSection === 3 ? 'active' : ''}`} id="section-planos" data-section="3">
        <div className="section-content planos-content w-full max-w-[1200px]">
          <h2 className="section-title text-glow">
            Três caminhos.
            <br />
            Uma filosofia.
          </h2>
          
          <div className="plans-grid">
            {/* Plan 1: Essencial */}
            <TiltCard className="plan-card" data-plan="essencial">
              <div className="plan-icon">🌱</div>
              <h3 className="plan-name">Essencial</h3>
              <p className="plan-desc">Landing page de alta conversão</p>
              <ul className="plan-features">
                <li>SEO otimizado</li>
                <li>Mobile-first</li>
                <li>WhatsApp integrado</li>
                <li>Formulários de captura</li>
              </ul>
              <span className="plan-audience">Comércio local e lançamentos</span>
            </TiltCard>

            {/* Plan 2: Profissional */}
            <TiltCard className="plan-card" isFeatured data-plan="profissional">
              <div className="plan-icon">🌿</div>
              <h3 className="plan-name">Profissional</h3>
              <p className="plan-desc">Plataformas escaláveis</p>
              <ul className="plan-features">
                <li>CRM integrado</li>
                <li>Pixels &amp; Analytics Premium</li>
                <li>Gestão de conteúdo (CMS)</li>
                <li>Fluxos de automação</li>
              </ul>
              <span className="plan-audience">Clínicas e empresas B2B</span>
            </TiltCard>

            {/* Plan 3: Experience */}
            <TiltCard className="plan-card" data-plan="experience">
              <div className="plan-icon">🌳</div>
              <h3 className="plan-name">Experience</h3>
              <p className="plan-desc">Experiência digital premium imersiva</p>
              <ul className="plan-features">
                <li>WebGL / Three.js</li>
                <li>Animações com GSAP</li>
                <li>UX/UI Exclusivo</li>
                <li>Performance Extrema</li>
              </ul>
              <span className="plan-audience">Marcas Premium e Portfólios</span>
              <div className="plan-badge">★ Este site é um exemplo</div>
            </TiltCard>
          </div>
        </div>
      </div>

      {/* Section 4: Portfólio */}
      <div className={`section-overlay ${activeSection === 4 ? 'active' : ''}`} id="section-portfolio" data-section="4">
        <PortfolioSection isActive={activeSection === 4} />
      </div>

      {/* Section 5: Depoimentos */}
      <div className={`section-overlay ${activeSection === 5 ? 'active' : ''}`} id="section-depoimentos" data-section="5">
        <TestimonialsSection isActive={activeSection === 5} />
      </div>

      {/* Section 6: Performance (Gestão) */}
      <div className={`section-overlay ${activeSection === 6 ? 'active' : ''}`} id="section-performance" data-section="6">
        <div className="section-content performance-content">
          <h2 className="section-title text-glow">
            Gestão que evolui
            <br />
            com você.
          </h2>

          <div className="tiers-grid mt-12 mx-auto">
            {/* Tier 1 */}
            <TiltCard className="tier-card">
              <h3 className="tier-name">Suporte Standard</h3>
              <div className="tier-price">
                R$ 250<span>/mês</span>
              </div>
              <ul className="tier-features">
                <li>Manutenção preventiva</li>
                <li>Hospedagem monitorada</li>
                <li>Apoio técnico</li>
              </ul>
            </TiltCard>

            {/* Tier 2 */}
            <TiltCard className="tier-card" isFeatured>
              <h3 className="tier-name">Gestão Growth</h3>
              <div className="tier-price">
                R$ 500<span>/mês</span>
              </div>
              <ul className="tier-features">
                <li>Tudo do Standard</li>
                <li>Relatório mensal de dados</li>
                <li>Call estratégica mensal</li>
                <li>Evolução contínua</li>
              </ul>
            </TiltCard>
          </div>
        </div>
      </div>

      {/* Section 7: FAQ */}
      <div className={`section-overlay ${activeSection === 7 ? 'active' : ''}`} id="section-faq" data-section="7">
        <FAQSection isActive={activeSection === 7} />
      </div>

      {/* Section 8: Call to Action Final */}
      <div className={`section-overlay ${activeSection === 8 ? 'active' : ''}`} id="section-cta" data-section="8">
        <div className="section-content cta-content flex flex-col items-center justify-center">
          <h2 className="section-title text-glow">
            O ciclo
            <br />
            continua.
          </h2>
          <p className="section-subtitle mb-8 text-white/70">
            Pronto para cultivar seu ecossistema digital premium?
          </p>
          
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <MagneticButton>
              <a
                href="https://wa.me/5551999019398?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os%20da%20Root%20Code."
                target="_blank"
                rel="noopener noreferrer"
                className="cta-button bg-glow/10 border-glow text-glow hover:bg-glow/20"
                id="cta-whatsapp"
              >
                <span className="cta-icon">📱</span>
                Chamar no WhatsApp
              </a>
            </MagneticButton>

            <MagneticButton>
              <a
                href="https://www.instagram.com/rootingcode"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-button"
                id="cta-instagram"
              >
                <span className="cta-icon">📸</span>
                Instagram
              </a>
            </MagneticButton>
          </div>
        </div>
      </div>

    </div>
  );
}
