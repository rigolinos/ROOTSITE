'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap-register';
import { MOTION } from '@/lib/animations';

interface PlanosSectionProps {
  isActive: boolean;
}

export default function PlanosSection({ isActive }: PlanosSectionProps) {
  const [activeTab, setActiveTab] = useState<'projetos' | 'manutencao'>('projetos');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      if (isActive) {
        gsap.fromTo(
          containerRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: MOTION.ease.reveal }
        );
      } else {
        gsap.to(containerRef.current, { opacity: 0, duration: 0.4 });
      }
    }, containerRef);
    return () => ctx.revert();
  }, [isActive]);

  return (
    <div className="relative z-10 w-full min-h-screen flex flex-col justify-center items-center px-4 md:px-8 py-20 opacity-0" ref={containerRef}>
      
      {/* Header & Toggle */}
      <div className="w-full max-w-4xl mx-auto text-center flex flex-col items-center mb-10 md:mb-16 relative z-20 flex-none mt-10 md:mt-0">
        <span className="font-mono text-xs tracking-[0.2em] font-semibold text-emerald-400 uppercase mb-2">
          INVESTIMENTO TRANSPARENTE
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-6 relative block">
          Escolha o formato ideal para acelerar seu negócio.
        </h2>
        
        <div className="inline-flex p-1 rounded-full bg-zinc-900/90 border border-white/[0.08] backdrop-blur-md relative z-30 shadow-xl">
          <button 
            onClick={() => setActiveTab('projetos')}
            className={`transition-all px-5 py-1.5 text-xs ${activeTab === 'projetos' ? 'bg-emerald-500 text-black font-semibold shadow-lg rounded-full' : 'text-stone-400 hover:text-white font-medium'}`}
          >
            Novos Projetos
          </button>
          <button 
            onClick={() => setActiveTab('manutencao')}
            className={`transition-all px-5 py-1.5 text-xs ${activeTab === 'manutencao' ? 'bg-emerald-500 text-black font-semibold shadow-lg rounded-full' : 'text-stone-400 hover:text-white font-medium'}`}
          >
            Manutenção & Gestão
          </button>
        </div>
      </div>

      {/* Grid: Projetos */}
      {activeTab === 'projetos' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto transition-all duration-500 relative z-20 flex-none">
          {/* Card 1 */}
          <div 
            className="bg-[#080d0a]/85 border border-white/[0.08] hover:border-emerald-500/30 rounded-2xl p-7 md:p-8 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between group"
            style={{ padding: '32px', minHeight: '460px', position: 'relative' }}
          >
            <div className="w-full relative z-10">
              <span className="inline-block text-[10px] font-mono font-semibold tracking-wider text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded-full mb-6">
                ENTREGA EM ATÉ 48H
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Landing Express</h3>
              <p className="text-emerald-400 font-semibold mb-4 text-sm">A partir de R$ 850</p>
              <p className="text-xs text-stone-400 mb-8 border-b border-white/[0.06] pb-6 leading-relaxed">
                Ideal para: Lançamentos rápidos, infoprodutos e campanhas diretas.
              </p>
              <ul className="space-y-2.5 text-xs text-stone-300 mb-8">
                {['No ar em até 48 horas', 'Foco total em conversão no WhatsApp', 'Carregamento instantâneo no mobile', 'Domínio e hospedagem configurados'].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-emerald-400 mr-2 shrink-0">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <a href="https://wa.me/5551999019398" target="_blank" rel="noopener noreferrer" className="w-full py-3 rounded-xl text-xs font-semibold text-white bg-white/5 border border-white/10 text-center hover:bg-white/10 transition-all mt-auto block relative z-10">
              Quero meu Site Express →
            </a>
          </div>

          {/* Card 2 */}
          <div 
            className="bg-[#080d0a]/95 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)] rounded-2xl p-7 md:p-8 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between transform md:-translate-y-4 relative overflow-hidden group"
            style={{ padding: '32px', minHeight: '460px', position: 'relative' }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-50 z-0" />
            <div className="w-full relative z-10">
              <span className="inline-block text-[10px] font-sans font-bold tracking-wider text-emerald-300 bg-emerald-950/80 border border-emerald-500/50 px-3 py-1 rounded-full mb-6">
                ★ MAIS ESCOLHIDO
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Institucional & B2B</h3>
              <p className="text-emerald-400 font-semibold mb-4 text-sm">Sob Medida</p>
              <p className="text-xs text-stone-400 mb-8 border-b border-white/[0.06] pb-6 leading-relaxed">
                Ideal para: Empresas e clínicas que exigem autoridade e posicionamento premium.
              </p>
              <ul className="space-y-2.5 text-xs text-stone-300 mb-8">
                {['Múltiplas páginas exclusivas (Sem templates)', 'Otimizado para o topo do Google (SEO)', 'Painel simples para você editar fotos e textos', 'Integração direta com CRM e formulários inteligentes'].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-emerald-400 mr-2 shrink-0">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <a href="https://wa.me/5551999019398" target="_blank" rel="noopener noreferrer" className="w-full py-3 rounded-xl text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 text-center transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] mt-auto block relative z-10">
              Solicitar Orçamento →
            </a>
          </div>

          {/* Card 3 */}
          <div 
            className="bg-[#080d0a]/85 border border-white/[0.08] hover:border-emerald-500/30 rounded-2xl p-7 md:p-8 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between group"
            style={{ padding: '32px', minHeight: '460px', position: 'relative' }}
          >
            <div className="w-full relative z-10">
              <span className="inline-block text-[10px] font-mono font-semibold tracking-wider text-stone-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full mb-6">
                EXCLUSIVO
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Software & Web 3D</h3>
              <p className="text-stone-400 font-semibold mb-4 text-sm">Projetos Especiais</p>
              <p className="text-xs text-stone-400 mb-8 border-b border-white/[0.06] pb-6 leading-relaxed">
                Ideal para: Startups, marcas de luxo e plataformas complexas.
              </p>
              <ul className="space-y-2.5 text-xs text-stone-300 mb-8">
                {['Design assinado com efeitos e 3D', 'Arquitetura escalável com banco de dados', 'Integrações completas via API', 'Suporte técnico prioritário'].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-emerald-400 mr-2 shrink-0">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <a href="https://wa.me/5551999019398" target="_blank" rel="noopener noreferrer" className="w-full py-3 rounded-xl text-xs font-semibold text-white bg-white/5 border border-white/10 text-center hover:bg-white/10 transition-all mt-auto block relative z-10">
              Falar com Engenheiro →
            </a>
          </div>
        </div>
      )}

      {/* Grid: Manutenção */}
      {activeTab === 'manutencao' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto transition-all duration-500 relative z-20 flex-none">
          {/* Manutenção 1 */}
          <div 
            className="bg-[#080d0a]/85 border border-white/[0.08] hover:border-emerald-500/30 rounded-2xl p-7 md:p-8 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between group"
            style={{ padding: '32px', minHeight: '460px', position: 'relative' }}
          >
            <div className="w-full relative z-10">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Suporte Standard</h3>
              <p className="text-emerald-400 font-semibold mb-4 text-sm">Hospedagem & Blindagem</p>
              <ul className="space-y-2.5 text-xs text-stone-300 mb-8 mt-6">
                {['Hospedagem em servidores ultrarrápidos (Edge/Cloud)', 'Backups diários automatizados e restauração imediata', 'Monitoramento de segurança e certificado SSL ativo', 'Suporte técnico direto via WhatsApp'].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-emerald-400 mr-2 shrink-0">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <a href="https://wa.me/5551999019398" target="_blank" rel="noopener noreferrer" className="w-full py-3 rounded-xl text-xs font-semibold text-white bg-white/5 border border-white/10 text-center hover:bg-white/10 transition-all mt-auto block relative z-10">
              Assinar Suporte →
            </a>
          </div>

          {/* Manutenção 2 */}
          <div 
            className="bg-[#080d0a]/95 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)] rounded-2xl p-7 md:p-8 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            style={{ padding: '32px', minHeight: '460px', position: 'relative' }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-50 z-0" />
            <div className="w-full relative z-10">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Gestão Growth</h3>
              <p className="text-emerald-400 font-semibold mb-4 text-sm">Parceria Estratégica</p>
              <ul className="space-y-2.5 text-xs text-stone-300 mb-8 mt-6">
                {['Tudo do plano Suporte Standard', 'Relatórios mensais de acessos, conversões e SEO', 'Reunião mensal de alinhamento e otimização', 'Horas inclusas para novas melhorias e alterações no site'].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-emerald-400 mr-2 shrink-0">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <a href="https://wa.me/5551999019398" target="_blank" rel="noopener noreferrer" className="w-full py-3 rounded-xl text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 text-center transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] mt-auto block relative z-10">
              Contratar Gestão →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
