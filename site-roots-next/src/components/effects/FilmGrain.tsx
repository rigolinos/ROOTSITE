'use client';

/**
 * Film Grain Overlay
 * Subtle cinematic texture using SVG noise filter.
 * Barely visible — premium subtlety.
 */
export default function FilmGrain() {
  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none"
      aria-hidden="true"
      style={{
        opacity: 0.035,
        mixBlendMode: 'overlay',
      }}
    >
      <svg className="hidden">
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
      <div
        className="absolute inset-0 animate-grain"
        style={{
          filter: 'url(#noiseFilter)',
          width: '300%',
          height: '300%',
          top: '-100%',
          left: '-100%',
        }}
      />
    </div>
  );
}
