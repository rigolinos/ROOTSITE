import Preloader from '@/components/preloader/Preloader';
import Navbar from '@/components/navigation/Navbar';
import VisualCanvas from '@/components/hero/VisualCanvas';
import SectionContent from '@/components/sections/SectionContent';

/**
 * Root Code — Cinematic Interactive One-Pager
 * 
 * Layout Architecture:
 * 1. Fixed Elements Layer (Canvas Background + Stacked Overlays)
 * 2. Virtual/Physical Scroll Container (800vh height track)
 * 
 * Synchronized entirely via the global frame ticking loop.
 */
export default function Home() {
  return (
    <>
      {/* Cinematic Load Screen */}
      <Preloader />

      {/* Global Navigation */}
      <Navbar />

      {/* ── Fixed Experience Layer ── */}
      {/* FIXED: Background Procedural L-System Canvas (z-1) */}
      <VisualCanvas />

      {/* FIXED: Text Overlays, Grids, 3D Cards, Stats & CTA (z-10) */}
      <SectionContent />

      {/* ── Scroll Physical Track Layer ── */}
      {/* 800vh height triggers scroll events for Lenis & GSAP ticker sync */}
      <main id="scroll-container" className="relative w-full h-[800vh] z-0 pointer-events-none" />
    </>
  );
}
