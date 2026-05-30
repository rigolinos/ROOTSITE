'use client';

import { useEffect, useRef, useState } from 'react';
import MagneticButton from '@/components/effects/MagneticButton';

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
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    card.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
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
  const [count, setCount] = useState<number>(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isActive) {
      if (!hasAnimated.current) {
        setCount(0);
      }
      return;
    }

    if (hasAnimated.current) return;
    hasAnimated.current = true;

    // Parse target
    let targetNum = 0;
    let suffix = '';

    if (typeof target === 'number') {
      targetNum = target;
    } else {
      targetNum = parseInt(target, 10);
      suffix = target.replace(String(targetNum), '');
    }

    if (isNaN(targetNum)) return;

    let start = 0;
    const duration = 1500; // ms
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * targetNum));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isActive, target]);

  return (
    <div className="stat-item">
      <div className="stat-number tabular-nums">
        {count}
        {typeof target === 'string' && target.includes('%') && '%'}
        {typeof target === 'string' && target.includes('/') && '/7'}
      </div>
      <div className="stat-label">
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
      
      {/* Section 1: Hero */}
      <div className="section-overlay" id="section-hero" data-section="0">
        <div className="section-content hero-content">
          <h1 className="hero-title">ROOT CODE</h1>
          <p className="hero-tagline">Eficiência Silenciosa</p>
          <p className="hero-subtitle">
            Cultivando ecossistemas digitais onde a complexidade
            <br />
            técnica floresce em simplicidade arquitetônica.
          </p>
        </div>
        <div className="scroll-indicator">
          <span>Scroll</span>
          <div className="scroll-arrow" />
        </div>
      </div>

      {/* Section 2: A Semente */}
      <div className="section-overlay" id="section-semente" data-section="1">
        <div className="section-content">
          <h2 className="section-title">
            Toda revolução digital
            <br />
            começa com uma ideia.
          </h2>
          <p className="section-subtitle">
            Transformamos conceitos em ecossistemas digitais — onde cada linha de código e cada automação se tornam raízes otimizadas que sustentam o crescimento dos seus processos e negócios.
          </p>
        </div>
      </div>

      {/* Section 3: O Código-Raiz */}
      <div className="section-overlay" id="section-codigo" data-section="2">
        <div className="section-content">
          <h2 className="section-title">
            Raízes invisíveis.
            <br />
            Estrutura inabalável.
          </h2>
          <p className="section-subtitle">
            Código limpo e processos otimizados — a base sólida que sustenta todo o ecossistema. Firme, invisível, mas estruturando o crescimento do seu negócio.
          </p>
        </div>
      </div>

      {/* Section 4: Planos */}
      <div className="section-overlay" id="section-planos" data-section="3">
        <div className="section-content planos-content">
          <h2 className="section-title">
            Três caminhos.
            <br />
            Uma filosofia.
          </h2>
          
          <div className="plans-grid">
            
            {/* Plan 1: Essencial */}
            <TiltCard className="plan-card" data-plan="essencial">
              <div className="plan-icon">🌱</div>
              <h3 className="plan-name">Essencial</h3>
              <p className="plan-desc">Landing page e site institucional</p>
              <ul className="plan-features">
                <li>SEO otimizado</li>
                <li>Mobile-first</li>
                <li>WhatsApp integrado</li>
                <li>Formulários</li>
              </ul>
              <span className="plan-audience">Comércio local, produtos B2C e profissionais</span>
            </TiltCard>

            {/* Plan 2: Profissional */}
            <TiltCard className="plan-card" isFeatured data-plan="profissional">
              <div className="plan-icon">🌿</div>
              <h3 className="plan-name">Profissional</h3>
              <p className="plan-desc">Portais e sites multipáginas com integrações de dados e serviços</p>
              <ul className="plan-features">
                <li>CRM integrado</li>
                <li>Pixels &amp; Analytics</li>
                <li>Blog</li>
                <li>E-mail marketing</li>
              </ul>
              <span className="plan-audience">Empresas B2B e clínicas</span>
            </TiltCard>

            {/* Plan 3: Experience */}
            <TiltCard className="plan-card" data-plan="experience">
              <div className="plan-icon">🌳</div>
              <h3 className="plan-name">Experience</h3>
              <p className="plan-desc">Experiência digital 3D sob medida</p>
              <ul className="plan-features">
                <li>WebGL / Three.js</li>
                <li>Animações avançadas</li>
                <li>UX Premium</li>
                <li>Suporte dedicado</li>
              </ul>
              <span className="plan-audience">Mercado premium e SaaS</span>
              <div className="plan-badge">★ Este site é um exemplo</div>
            </TiltCard>

          </div>
        </div>
      </div>

      {/* Section 5: Crescimento */}
      <div className="section-overlay" id="section-crescimento" data-section="4">
        <div className="section-content">
          <h2 className="section-title">
            Seu projeto
            <br />
            ganha vida.
          </h2>
          <p className="section-subtitle">
            Do primeiro pixel ao ecossistema completo — acompanhamos cada fase do crescimento digital do seu negócio.
          </p>
        </div>
      </div>

      {/* Section 6: Performance */}
      <div className="section-overlay" id="section-performance" data-section="5">
        <div className="section-content performance-content">
          <h2 className="section-title">
            Gestão que evolui
            <br />
            com você.
          </h2>

          <div className="tiers-grid">
            
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

      {/* Section 7: Resultados */}
      <div className="section-overlay" id="section-resultados" data-section="6">
        <div className="section-content resultados-content">
          <h2 className="section-title">
            Eficiência
            <br />
            que se mede.
          </h2>

          <div className="stats-grid">
            <StatItem
              target={30}
              isActive={activeSection === 6}
              label={<>dias de garantia<br />pós-entrega</>}
            />
            <StatItem
              target="100%"
              isActive={activeSection === 6}
              label={<>foco em performance<br />técnica</>}
            />
            <StatItem
              target="24/7"
              isActive={activeSection === 6}
              label={<>monitoramento<br />de uptime</>}
            />
          </div>

          <p className="section-subtitle">
            Performance técnica sem ruídos — garantindo que o software seja uma ferramenta de simplificação para o seu negócio.
          </p>
        </div>
      </div>

      {/* Section 8: CTA / Loop */}
      <div className="section-overlay" id="section-cta" data-section="7">
        <div className="section-content cta-content">
          <h2 className="section-title">
            O ciclo
            <br />
            continua.
          </h2>
          <p className="section-subtitle">
            Pronto para cultivar seu ecossistema digital?
          </p>
          
          <MagneticButton>
            <a
              href="mailto:rootcodecontato@gmail.com"
              className="cta-button"
              id="cta-email"
            >
              <span className="cta-icon">💬</span>
              Fale conosco
            </a>
          </MagneticButton>
        </div>
      </div>

    </div>
  );
}
