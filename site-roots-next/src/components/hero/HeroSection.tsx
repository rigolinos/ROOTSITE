'use client';

import GradientMesh from './GradientMesh';
import LeafSVG from './LeafSVG';
import HeroTypography from './HeroTypography';
import ScrollIndicator from './ScrollIndicator';

/**
 * Hero Section — Full viewport cinematic landing
 * Layers: GradientMesh → Dark overlay → Content (Leaf + Text) → ScrollIndicator
 */
export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{ height: '100dvh' }}
    >
      {/* Layer 1: Gradient Mesh Background */}
      <GradientMesh />

      {/* Layer 2: Dark overlay for contrast */}
      <div className="absolute inset-0 z-10 bg-black/40" aria-hidden="true" />

      {/* Layer 3: Content */}
      <div className="relative z-20 flex flex-col items-center px-6">
        <LeafSVG />
        <HeroTypography />
      </div>

      {/* Layer 4: Scroll Indicator */}
      <ScrollIndicator />
    </section>
  );
}
