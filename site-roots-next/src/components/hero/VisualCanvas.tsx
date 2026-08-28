'use client';

import { useEffect, useRef } from 'react';
import { useLenis } from '@/hooks/useLenis';
import { VisualEngine, clamp, smoothstep } from '@/lib/VisualEngine';
import { ScrollTrigger } from '@/lib/gsap-register';

const SECTION_COUNT = 9;

function getSectionProgress(scrollProgress: number) {
  const sectionSize = 1 / SECTION_COUNT;
  const currentSection = Math.floor(scrollProgress / sectionSize);
  const sectionProgress = (scrollProgress % sectionSize) / sectionSize;
  return {
    index: clamp(currentSection, 0, SECTION_COUNT - 1),
    progress: clamp(sectionProgress, 0, 1),
  };
}

export default function VisualCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lenis = useLenis();
  const engineRef = useRef<VisualEngine | null>(null);
  
  // Animation state refs to avoid React re-renders in raf loop
  const scrollState = useRef({
    targetProgress: 0,
    currentProgress: 0,
    currentSection: -1,
    looping: false,
    lastTime: 0,
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    // Instantiate 2D Visual Engine
    const engine = new VisualEngine(canvasRef.current);
    engineRef.current = engine;

    // Cache section elements from DOM
    const sections = Array.from(document.querySelectorAll('.section-overlay')) as HTMLElement[];

    // Resize handler
    const handleResize = () => {
      if (engineRef.current) {
        engineRef.current.resize();
      }
    };
    window.addEventListener('resize', handleResize);

    // Main animation ticker
    let animId: number;
    scrollState.current.lastTime = performance.now();

    const tick = () => {
      animId = requestAnimationFrame(tick);

      const now = performance.now();
      const deltaTime = (now - scrollState.current.lastTime) / 1000;
      scrollState.current.lastTime = now;

      // Direct progress polling from Lenis to prevent event queue stuttering
      if (!scrollState.current.looping) {
        if (lenis) {
          scrollState.current.targetProgress = clamp(lenis.progress, 0, 0.999);
        } else {
          const scrollTop = window.scrollY || window.pageYOffset;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          scrollState.current.targetProgress = clamp(scrollTop / Math.max(docHeight, 1), 0, 0.999);
        }
      }

      // Smooth scroll interpolation with faster/snappier lerp (0.12)
      scrollState.current.currentProgress += 
        (scrollState.current.targetProgress - scrollState.current.currentProgress) * 0.12;

      const progress = scrollState.current.currentProgress;

      // ═══ S3.3: MICRO-PAUSE — Slow canvas animation in decision sections ═══
      const { index: currentIdx } = getSectionProgress(progress);
      const isDecisionSection = [5, 6, 7].includes(currentIdx); // Planos, Gestão, FAQ
      const canvasSpeedMultiplier = isDecisionSection ? 0.2 : 1.0;
      const adjustedDeltaTime = deltaTime * canvasSpeedMultiplier;

      // Draw Visual Engine Canvas frame
      if (engineRef.current) {
        engineRef.current.draw(progress, adjustedDeltaTime);
      }

      // Update Section Overlay opacities and parallax translations
      const { index, progress: secProgress } = getSectionProgress(progress);

      // Handle active state class toggle (pointer-events controls)
      if (index !== scrollState.current.currentSection) {
        if (scrollState.current.currentSection >= 0 && scrollState.current.currentSection < sections.length) {
          sections[scrollState.current.currentSection]?.classList.remove('active');
        }
        if (index >= 0 && index < sections.length) {
          sections[index]?.classList.add('active');
        }
        scrollState.current.currentSection = index;
        window.dispatchEvent(new CustomEvent('activeSectionChange', { detail: { index } }));
      }

      // Live styling update on every frame for all sections
      sections.forEach((el, i) => {
        if (i === index) {
          let opacity = 0;
          if (i === 0) {
            // Hero: fully visible from start, fades out at the end
            opacity = 1 - smoothstep(0.8, 0.95, secProgress);
          } else if (i === SECTION_COUNT - 1) {
            // CTA: fades in and stays
            opacity = smoothstep(0.15, 0.4, secProgress);
          } else {
            // S2.1: Wider fade curves — content visible for 76% of section (was 64%)
            const fadeIn = smoothstep(0.0, 0.12, secProgress);
            const fadeOut = 1 - smoothstep(0.88, 1.0, secProgress);
            opacity = fadeIn * fadeOut;
          }
          el.style.opacity = String(opacity);

          // Parallax translate on the inner content container
          const translateY = (0.5 - secProgress) * 25;
          const content = el.querySelector('.section-content') as HTMLElement;
          if (content) {
            content.style.transform = `translateY(${translateY}px)`;
          }
        } else {
          el.style.opacity = '0';
        }
      });

      // ═══ S1.2: DYNAMIC CANVAS DIMMING — Per-section opacity profiles ═══
      // Narrative sections: canvas present but subordinate. Decision sections: minimal distraction.
      if (canvasRef.current) {
        const SECTION_CANVAS_OPACITY: Record<number, number> = {
          0: 1.0,   // Hero — canvas is protagonist
          1: 0.20,  // Manifesto — text + canvas coexist
          2: 0.18,  // Processo — structured content
          3: 0.20,  // Projetos — cards need focus
          4: 0.18,  // Depoimentos — social proof, text important
          5: 0.10,  // Planos — purchase decision, minimal distraction
          6: 0.10,  // Gestão — purchase decision
          7: 0.12,  // FAQ — dense reading
          8: 0.08,  // Contato — maximum focus on CTA
        };

        let targetCanvasOpacity = SECTION_CANVAS_OPACITY[index] ?? 0.25;

        // Hero: fade canvas down as we transition out
        if (index === 0) {
          targetCanvasOpacity = 1 - smoothstep(0.7, 1.0, secProgress) * 0.65;
        }

        // Smooth lerp transition between opacity profiles (0.05 for max smoothness)
        const currentCanvasOpacity = parseFloat(canvasRef.current.style.opacity || '1');
        const lerpedOpacity = currentCanvasOpacity + (targetCanvasOpacity - currentCanvasOpacity) * 0.05;
        canvasRef.current.style.opacity = String(lerpedOpacity);
      }
    };

    tick();

    // Infinite loop reset handler (near bottom -> seamless scroll back to top)
    const loopInterval = setInterval(() => {
      if (scrollState.current.looping) return;
      if (scrollState.current.targetProgress > 0.97) {
        scrollState.current.looping = true;
        setTimeout(() => {
          if (lenis) {
            lenis.scrollTo(0, { immediate: true });
          } else {
            window.scrollTo({ top: 0, behavior: 'auto' });
          }
          scrollState.current.currentProgress = 0;
          scrollState.current.targetProgress = 0;
          setTimeout(() => {
            scrollState.current.looping = false;
          }, 200);
        }, 400);
      }
    }, 500);

    return () => {
      cancelAnimationFrame(animId);
      if (engineRef.current) {
        engineRef.current.destroy();
      }
      clearInterval(loopInterval);
      window.removeEventListener('resize', handleResize);
    };
  }, [lenis]);

  return (
    <canvas
      ref={canvasRef}
      id="visual-canvas"
      className="fixed top-0 left-0 w-full h-full z-[1] pointer-events-none"
    />
  );
}
