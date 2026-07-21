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

      {/* Section 3: Projetos (ex-Portfólio) */}
      <div className={`section-overlay ${activeSection === 3 ? 'active' : ''}`} id="section-projetos" data-section="3">
        <PortfolioSection isActive={activeSection === 3} />
      </div>

      {/* Section 4: Depoimentos */}
      <div className={`section-overlay ${activeSection === 4 ? 'active' : ''}`} id="section-depoimentos" data-section="4">
        <TestimonialsSection isActive={activeSection === 4} />
      </div>

      {/* Section 5: Serviços (Planos) */}
      <div className={`section-overlay ${activeSection === 5 ? 'active' : ''}`} id="section-servicos" data-section="5">
        <div className="section-content planos-content w-full max-w-[1200px]">
          <h2 className="section-title text-glow">
            Soluções Sob Medida
          </h2>
          <p className="text-white/70 text-center mb-8 md:mb-12 text-sm md:text-lg font-light max-w-xl mx-auto">
            Escolha o formato ideal para o momento do seu negócio.
          </p>
          
          <div className="plans-grid">
            {/* Plan 1: Essencial */}
            <TiltCard className="plan-card" data-plan="essencial">
              <div className="plan-icon">🌱</div>
              <h3 className="plan-name">Essencial</h3>
              <p className="plan-desc">Ideal para lançar um produto, serviço ou campanha com foco total e imediato em captação de clientes.</p>
              <ul className="plan-features">
                <li>Design focado em conversão para WhatsApp</li>
                <li>Otimização total para telas mobile</li>
                <li>Formulários inteligentes de captação</li>
                <li>Integração com ferramentas de anúncios</li>
              </ul>
              <span className="plan-audience">Lançamentos e profissionais liberais</span>
              <div className="plan-badge font-mono text-[0.65rem] tracking-wider">[ PROPOSTA SOB MEDIDA ]</div>
            </TiltCard>

            {/* Plan 2: Profissional */}
            <TiltCard className="plan-card" isFeatured data-plan="profissional">
              <div className="plan-icon">🌿</div>
              <h3 className="plan-name">Profissional</h3>
              <p className="plan-desc">A solução completa para empresas que buscam autoridade inquestionável, posicionamento premium e múltiplos canais.</p>
              <ul className="plan-features">
                <li>Múltiplas páginas personalizadas</li>
                <li>Painel amigável para atualizar conteúdos (CMS)</li>
                <li>SEO avançado para ser encontrado no Google</li>
                <li>Integração completa com CRM e automações</li>
              </ul>
              <span className="plan-audience">Clínicas, escritórios e empresas B2B</span>
              <div className="plan-badge">★ MAIS SOLICITADO</div>
            </TiltCard>

            {/* Plan 3: Experience */}
            <TiltCard className="plan-card" data-plan="experience">
              <div className="plan-icon">🌳</div>
              <h3 className="plan-name">Experience</h3>
              <p className="plan-desc">Uma experiência visual cinematográfica com animações 3D e interatividade avançada para marcas que lideram seus mercados.</p>
              <ul className="plan-features">
                <li>Animações interativas e elementos 3D</li>
                <li>Experiência de navegação exclusiva</li>
                <li>Arquitetura de altíssimo desempenho</li>
                <li>Design assinado para impressionar investidores</li>
              </ul>
              <span className="plan-audience">Marcas de luxo, construtoras e startups</span>
              <div className="plan-badge font-mono text-[0.65rem] tracking-wider">[ PROJETO EXCLUSIVO ]</div>
            </TiltCard>
          </div>
        </div>
      </div>

      {/* Section 6: Performance (Gestão) */}
      <div className={`section-overlay ${activeSection === 6 ? 'active' : ''}`} id="section-gestao" data-section="6">
        <div className="section-content performance-content w-full max-w-[1000px]">
          <h2 className="section-title text-glow">
            Evolução &amp; Manutenção Contínua
          </h2>
          <p className="text-white/70 text-center mb-10 md:mb-14 text-sm md:text-lg font-light max-w-2xl mx-auto">
            Seu site sempre atualizado, seguro e gerando resultados sem você se preocupar com tecnologia.
          </p>

          <div className="tiers-grid mt-4 mx-auto">
            {/* Tier 1 */}
            <TiltCard className="tier-card">
              <span className="text-xs font-semibold text-glow uppercase tracking-widest block mb-2">[ Manutenção &amp; Hospedagem ]</span>
              <h3 className="tier-name">Suporte Standard</h3>
              <ul className="tier-features">
                <li>Hospedagem de alta velocidade</li>
                <li>Backups diários automatizados</li>
                <li>Monitoramento de segurança 24/7</li>
                <li>Suporte técnico prioritário</li>
              </ul>
            </TiltCard>

            {/* Tier 2 */}
            <TiltCard className="tier-card" isFeatured>
              <span className="text-xs font-semibold text-glow uppercase tracking-widest block mb-2">[ Parceria Estratégica ]</span>
              <h3 className="tier-name">Gestão Growth</h3>
              <ul className="tier-features">
                <li>Tudo do Suporte Standard</li>
                <li>Relatório mensal de acessos e dados</li>
                <li>Reunião estratégica mensal de otimização</li>
                <li>Evolução contínua e melhorias no site</li>
              </ul>
            </TiltCard>
          </div>
        </div>
      </div>

      {/* Section 7: FAQ */}
      <div className={`section-overlay ${activeSection === 7 ? 'active' : ''}`} id="section-faq" data-section="7">
        <FAQSection isActive={activeSection === 7} />
      </div>

      <div className={`section-overlay ${activeSection === 8 ? 'active' : ''}`} id="section-contato" data-section="8">
        <div className="section-content cta-content flex flex-col items-center justify-start pt-[12vh]">
          <h2 
            className="section-title text-glow leading-tight mb-4 text-center max-w-4xl"
            style={{ fontSize: 'clamp(2rem, 5.5vw, 4.2rem)' }}
          >
            Pronto para elevar o nível da sua empresa?
          </h2>
          <p className="section-subtitle mb-8 text-white/80 text-center max-w-xl mx-auto text-sm md:text-lg font-light leading-relaxed">
            Converse com nossa equipe agora mesmo. Analisamos seu projeto e enviamos uma proposta sob medida em até 2 horas.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4">
            <MagneticButton>
              <a
                href="https://wa.me/5551999019398?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os%20da%20Root%20Code."
                target="_blank"
                rel="noopener noreferrer"
                className="cta-button cta-button--primary flex items-center justify-center gap-3 px-8 py-4"
                id="cta-whatsapp"
              >
                <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Quero Solicitar um Orçamento no WhatsApp →
              </a>
            </MagneticButton>
            <span className="text-white/40 text-xs tracking-wider font-mono">RESPOSTA RÁPIDA • SEM COMPROMISSO</span>

            <MagneticButton>
              <a
                href="https://www.instagram.com/rootingcode"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-button cta-button--secondary flex items-center justify-center gap-2 mt-2"
                id="cta-instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
                Acompanhe Nosso Trabalho no Instagram
              </a>
            </MagneticButton>
          </div>
        </div>
      </div>

    </div>
  );
}
