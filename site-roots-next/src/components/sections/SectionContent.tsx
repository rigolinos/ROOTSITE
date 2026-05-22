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
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden cursor-default transition-all duration-300 ease-out select-none border border-sage/15 rounded-2xl ${
        isFeatured
          ? 'bg-forest/50 border-glow/30 after:absolute after:top-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-transparent after:via-glow after:to-transparent'
          : 'bg-forest/20 hover:border-sage/35'
      } ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
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
    <div className="text-center">
      <div className="text-5xl md:text-7xl font-extrabold text-glow-strong text-gold mb-2 tabular-nums">
        {count}
        {typeof target === 'string' && target.includes('%') && '%'}
        {typeof target === 'string' && target.includes('/') && '/7'}
      </div>
      <div className="text-xs md:text-sm text-sage leading-relaxed">
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
      
      {/* SECTION 1: Hero */}
      <div className="section-overlay flex items-center justify-center absolute inset-0 w-full h-full opacity-0 pointer-events-none" id="section-hero" data-section="0">
        <div className="section-content text-center max-w-[900px] px-8 pb-16 pointer-events-auto">
          <h1 className="hero-title text-glow font-manrope text-5xl md:text-8xl font-extrabold tracking-[0.15em] mb-4 text-white uppercase select-none">
            ROOT CODE
          </h1>
          <p className="hero-tagline text-base md:text-2xl font-light tracking-[0.4em] uppercase text-sage mb-8 select-none">
            Eficiência Silenciosa
          </p>
          <p className="hero-subtitle text-sm md:text-lg leading-relaxed text-white/60 max-w-[600px] mx-auto select-none">
            Cultivando ecossistemas digitais onde a complexidade
            <br />
            técnica floresce em simplicidade arquitetônica.
          </p>
        </div>
        <div className="scroll-indicator absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-fade-in-up">
          <span className="text-[10px] tracking-[0.3em] uppercase text-sage">Scroll</span>
          <div className="scroll-arrow w-[1px] h-10 bg-gradient-to-b from-sage to-transparent animate-scroll-pulse" />
        </div>
      </div>

      {/* SECTION 2: Semente / Origem */}
      <div className="section-overlay flex items-center justify-center absolute inset-0 w-full h-full opacity-0 pointer-events-none" id="section-semente" data-section="1">
        <div className="section-content text-center max-w-[900px] px-8 pointer-events-auto">
          <div className="text-xs font-semibold text-glow tracking-[0.3em] uppercase mb-4 text-glow-strong select-none">
            [ NOSSA ORIGEM ]
          </div>
          <h2 className="section-title text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight mb-6">
            Fundada sob o princípio
            <br />
            da eficiência silenciosa.
          </h2>
          <p className="section-subtitle text-sm md:text-lg leading-relaxed text-white/60 max-w-[650px] mx-auto">
            A Root Code nasceu da paixão por eliminar o ruído e cultivar o essencial. Desenvolvemos ecossistemas digitais de alta performance que operam como raízes invisíveis: estruturas sólidas, limpas e inabaláveis que impulsionam e sustentam silenciosamente o crescimento de marcas e negócios memoráveis.
          </p>
        </div>
      </div>

      {/* SECTION 3: O Código-Raiz */}
      <div className="section-overlay flex items-center justify-center absolute inset-0 w-full h-full opacity-0 pointer-events-none" id="section-codigo" data-section="2">
        <div className="section-content text-center max-w-[900px] px-8 pointer-events-auto">
          <h2 className="section-title text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight mb-6">
            Raízes invisíveis.
            <br />
            Estrutura inabalável.
          </h2>
          <p className="section-subtitle text-sm md:text-lg leading-relaxed text-white/60 max-w-[550px] mx-auto">
            Código limpo, arquitetura sólida — a base que sustenta todo o ecossistema. Firme, invisível, mas sustentando toda a estrutura superior.
          </p>
        </div>
      </div>

      {/* SECTION 4: Planos / Serviços */}
      <div className="section-overlay flex items-center justify-center absolute inset-0 w-full h-full opacity-0 pointer-events-none" id="section-planos" data-section="3">
        <div className="section-content text-center max-w-[1000px] px-8 pointer-events-auto">
          <div className="text-xs font-semibold text-glow tracking-[0.3em] uppercase mb-4 text-glow-strong select-none">
            [ NOSSOS SERVIÇOS ]
          </div>
          <h2 className="section-title text-3xl md:text-5xl font-bold tracking-tight text-white mb-8">
            Três caminhos.
            <br />
            Uma filosofia.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[900px] mx-auto mt-6">
            
            {/* Plan 1: Essencial */}
            <TiltCard className="p-6 md:p-8 text-left">
              <div className="text-3xl mb-4">🌱</div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Essencial</h3>
              <div className="text-sm font-semibold text-glow text-glow-strong text-glow mb-4">A partir de R$ 1.000</div>
              <p className="text-xs md:text-sm text-white/60 mb-6 leading-relaxed">Landing page otimizada para conversão</p>
              <ul className="space-y-3 mb-6">
                <li className="text-xs md:text-sm text-white/60 pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-glow before:font-bold">SEO otimizado</li>
                <li className="text-xs md:text-sm text-white/60 pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-glow before:font-bold">Mobile-first</li>
                <li className="text-xs md:text-sm text-white/60 pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-glow before:font-bold">WhatsApp integrado</li>
                <li className="text-xs md:text-sm text-white/60 pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-glow before:font-bold">Formulários</li>
              </ul>
              <div className="text-[10px] tracking-wider uppercase font-semibold text-sage">Comércio local e profissionais</div>
            </TiltCard>

            {/* Plan 2: Profissional */}
            <TiltCard className="p-6 md:p-8 text-left" isFeatured>
              <div className="text-3xl mb-4">🌿</div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Profissional</h3>
              <div className="text-sm font-semibold text-glow text-glow-strong text-glow mb-4">A partir de R$ 2.500</div>
              <p className="text-xs md:text-sm text-white/60 mb-6 leading-relaxed">Site multipáginas com inteligência de dados</p>
              <ul className="space-y-3 mb-6">
                <li className="text-xs md:text-sm text-white/60 pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-glow before:font-bold">CRM integrado</li>
                <li className="text-xs md:text-sm text-white/60 pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-glow before:font-bold">Pixels &amp; Analytics</li>
                <li className="text-xs md:text-sm text-white/60 pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-glow before:font-bold">Blog</li>
                <li className="text-xs md:text-sm text-white/60 pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-glow before:font-bold">E-mail marketing</li>
              </ul>
              <div className="text-[10px] tracking-wider uppercase font-semibold text-sage">Empresas B2B e clínicas</div>
            </TiltCard>

            {/* Plan 3: Experience */}
            <TiltCard className="p-6 md:p-8 text-left">
              <div className="text-3xl mb-4">🌳</div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Experience</h3>
              <div className="text-sm font-semibold text-glow text-glow-strong text-glow mb-4">A partir de R$ 4.000</div>
              <p className="text-xs md:text-sm text-white/60 mb-6 leading-relaxed">Experiência digital 3D sob medida</p>
              <ul className="space-y-3 mb-6">
                <li className="text-xs md:text-sm text-white/60 pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-glow before:font-bold">WebGL / Three.js</li>
                <li className="text-xs md:text-sm text-white/60 pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-glow before:font-bold">Animações avançadas</li>
                <li className="text-xs md:text-sm text-white/60 pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-glow before:font-bold">UX Premium</li>
                <li className="text-xs md:text-sm text-white/60 pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-glow before:font-bold">Suporte dedicado</li>
              </ul>
              <div className="text-[10px] tracking-wider uppercase font-semibold text-sage mb-2">Mercado premium e SaaS</div>
              <div className="absolute top-4 right-4 text-[9px] font-bold bg-glow/15 text-glow px-2.5 py-1 rounded-full border border-glow/20">★ Este site é um exemplo</div>
            </TiltCard>

          </div>
        </div>
      </div>

      {/* SECTION 5: Crescimento */}
      <div className="section-overlay flex items-center justify-center absolute inset-0 w-full h-full opacity-0 pointer-events-none" id="section-crescimento" data-section="4">
        <div className="section-content text-center max-w-[900px] px-8 pointer-events-auto">
          <h2 className="section-title text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight mb-6">
            Seu projeto
            <br />
            ganha vida.
          </h2>
          <p className="section-subtitle text-sm md:text-lg leading-relaxed text-white/60 max-w-[550px] mx-auto">
            Do primeiro pixel ao ecossistema completo — acompanhamos cada fase do crescimento digital do seu negócio.
          </p>
        </div>
      </div>

      {/* SECTION 6: Performance */}
      <div className="section-overlay flex items-center justify-center absolute inset-0 w-full h-full opacity-0 pointer-events-none" id="section-performance" data-section="5">
        <div className="section-content text-center max-w-[1000px] px-8 pointer-events-auto">
          <h2 className="section-title text-3xl md:text-5xl font-bold tracking-tight text-white mb-8">
            Gestão que evolui
            <br />
            com você.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[700px] mx-auto mt-6">
            
            {/* Tier 1 */}
            <TiltCard className="p-8 text-left">
              <h3 className="text-lg md:text-xl font-bold text-white mb-3">Suporte Standard</h3>
              <div className="text-3xl md:text-4xl font-extrabold text-glow text-glow-strong mb-6">
                R$ 250<span className="text-xs md:text-sm font-normal text-white/60">/mês</span>
              </div>
              <ul className="space-y-3">
                <li className="text-xs md:text-sm text-white/60 pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-glow before:font-bold">Manutenção preventiva</li>
                <li className="text-xs md:text-sm text-white/60 pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-glow before:font-bold">Hospedagem monitorada</li>
                <li className="text-xs md:text-sm text-white/60 pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-glow before:font-bold">Apoio técnico</li>
              </ul>
            </TiltCard>

            {/* Tier 2 */}
            <TiltCard className="p-8 text-left" isFeatured>
              <h3 className="text-lg md:text-xl font-bold text-white mb-3">Gestão Growth</h3>
              <div className="text-3xl md:text-4xl font-extrabold text-glow text-glow-strong mb-6">
                R$ 500<span className="text-xs md:text-sm font-normal text-white/60">/mês</span>
              </div>
              <ul className="space-y-3">
                <li className="text-xs md:text-sm text-white/60 pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-glow before:font-bold">Tudo do Standard</li>
                <li className="text-xs md:text-sm text-white/60 pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-glow before:font-bold">Relatório mensal de dados</li>
                <li className="text-xs md:text-sm text-white/60 pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-glow before:font-bold">Call estratégica mensal</li>
                <li className="text-xs md:text-sm text-white/60 pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-glow before:font-bold">Evolução contínua</li>
              </ul>
            </TiltCard>

          </div>
        </div>
      </div>

      {/* SECTION 7: Resultados */}
      <div className="section-overlay flex items-center justify-center absolute inset-0 w-full h-full opacity-0 pointer-events-none" id="section-resultados" data-section="6">
        <div className="section-content text-center max-w-[1000px] px-8 pointer-events-auto">
          <h2 className="section-title text-3xl md:text-5xl font-bold tracking-tight text-white mb-8">
            Eficiência
            <br />
            que se mede.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[800px] mx-auto mb-10 mt-6">
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

          <p className="section-subtitle text-sm md:text-lg leading-relaxed text-white/60 max-w-[550px] mx-auto mt-6">
            Performance técnica sem ruídos — garantindo que o software seja uma ferramenta de simplificação para o seu negócio.
          </p>
        </div>
      </div>

      {/* SECTION 8: CTA / Contato */}
      <div className="section-overlay flex items-center justify-center absolute inset-0 w-full h-full opacity-0 pointer-events-none" id="section-cta" data-section="7">
        <div className="section-content text-center max-w-[900px] px-8 pointer-events-auto">
          <div className="text-xs font-semibold text-glow tracking-[0.3em] uppercase mb-4 text-glow-strong select-none">
            [ CONTATO ]
          </div>
          <h2 className="section-title text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight mb-4">
            O ciclo
            <br />
            continua.
          </h2>
          <p className="section-subtitle text-sm md:text-lg leading-relaxed text-white/60 max-w-[550px] mx-auto mb-8">
            Pronto para cultivar seu ecossistema digital?
          </p>
          
          <div className="inline-block mt-4">
            <MagneticButton>
              <a
                href="https://wa.me/5500000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-button inline-flex items-center gap-3 px-10 py-4 bg-forest border border-glow/30 hover:border-glow text-white text-lg font-semibold rounded-full shadow-lg shadow-glow/10 hover:shadow-glow/25 select-none relative overflow-hidden transition-all duration-300 group animate-glow-pulse cursor-pointer"
                id="cta-whatsapp"
              >
                <span className="text-xl">💬</span>
                Fale conosco
              </a>
            </MagneticButton>
          </div>
        </div>
      </div>

    </div>
  );
}
