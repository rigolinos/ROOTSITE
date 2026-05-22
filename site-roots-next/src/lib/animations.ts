/**
 * Root Code — Motion Design Constants
 * All animation timings, eases, and scrub values are centralized here.
 * 
 * RULES (INVIOLABLE):
 * 1. Minimum duration: 0.8s — the site must BREATHE
 * 2. FORBIDDEN: "linear", "ease-in-out", "power1" 
 * 3. ONLY high-deceleration curves: expo.out, power4.out, power3.out
 */

export const MOTION = {
  duration: {
    min: 0.8,
    default: 1.2,
    hero: 1.4,
    slow: 1.6,
  },
  stagger: {
    chars: 0.08,
    cards: 0.25,
    sections: 0.15,
    lines: 0.12,
  },
  ease: {
    reveal: 'expo.out',
    slide: 'power4.out',
    fade: 'power3.out',
    elastic: 'elastic.out(1, 0.5)',
  },
  scrub: {
    smooth: 1.2,
    cinematic: 1.5,
  },
  delay: {
    afterHero: 0.3,
    afterPrimary: 0.4,
    secondary: 0.2,
  },
} as const;

/** Brand colors for GSAP animations (where Tailwind classes can't reach) */
export const BRAND = {
  forest: '#1B3022',
  sage: '#98A99A',
  offwhite: '#F2F4F2',
  glow: '#4ADE80',
  gold: '#C8A96E',
  bgdark: '#0A0F0D',
  bgmid: '#0F1A13',
  white: '#FFFFFF',
} as const;
