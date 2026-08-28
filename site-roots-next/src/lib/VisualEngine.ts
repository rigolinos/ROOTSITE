// ============================================
// Root Code — Canvas 2D Visual Engine (TypeScript)
// Crisp, recognizable shapes: leaf, veins, roots, tree
// 
// EVENT BRIDGE TYPINGS:
// Strict interfaces for cross-DOM communication
// ============================================

export interface RootHoverEventDetail {
  segmentId: string | null;
}

export interface TestimonialActiveEventDetail {
  index: number;
}

declare global {
  interface WindowEventMap {
    'root-hover': CustomEvent<RootHoverEventDetail>;
    'testimonial-active': CustomEvent<TestimonialActiveEventDetail>;
  }
}

// ── Math & Interpolation Helpers ────────────────
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ── Types ───────────────────────────────────────
interface DustParticle {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  opacity: number;
  phase: number;
}

interface Branch {
  start: [number, number];
  end: [number, number];
  depth: number;
  thickness: number;
  length: number;
}

// ── Brand Colors ────────────────────────────────
const COLORS = {
  forest: '#1B3022',
  sage: '#98A99A',
  glow: '#4ADE80',
  gold: '#C8A96E',
  goldLight: '#E8D5A8',
  white: '#FFFFFF',
  bgDark: '#0A0F0D',
  bgMid: '#0F1A13',
};

// ── Ambient Particle Pool ───────────────────────
function createDustParticles(count: number): DustParticle[] {
  const particles: DustParticle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random(),
      y: Math.random(),
      size: 0.5 + Math.random() * 1.5,
      speed: 0.0001 + Math.random() * 0.0003,
      drift: (Math.random() - 0.5) * 0.0002,
      opacity: 0.08 + Math.random() * 0.15,
      phase: Math.random() * Math.PI * 2,
    });
  }
  return particles;
}

// ── Generate Branching Structure ────────────────
function generateBranches(
  startX: number,
  startY: number,
  angle: number,
  length: number,
  depth: number,
  maxDepth: number,
  seed: number
): Branch[] {
  if (depth > maxDepth || length < 8) return [];

  const endX = startX + Math.cos(angle) * length;
  const endY = startY + Math.sin(angle) * length;
  const thickness = Math.max(0.5, 2.5 - depth * 0.4);

  const branch: Branch = {
    start: [startX, startY],
    end: [endX, endY],
    depth,
    thickness,
    length: Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2),
  };

  const children: Branch[] = [];
  let currentSeed = seed;
  const rng = () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  };

  if (depth < maxDepth) {
    const spread = 0.35 + rng() * 0.3;
    const shrink = 0.62 + rng() * 0.13;
    children.push(
      ...generateBranches(endX, endY, angle - spread, length * shrink, depth + 1, maxDepth, currentSeed + 1)
    );
    children.push(
      ...generateBranches(endX, endY, angle + spread, length * shrink, depth + 1, maxDepth, currentSeed + 2)
    );
    if (rng() > 0.55) {
      children.push(
        ...generateBranches(
          endX,
          endY,
          angle + (rng() - 0.5) * 0.2,
          length * shrink * 0.7,
          depth + 1,
          maxDepth,
          currentSeed + 3
        )
      );
    }
  }
  return [branch, ...children];
}

export class VisualEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private w: number = 0;
  private h: number = 0;
  private dpr: number = 1;
  private dust: DustParticle[];
  private time: number = 0;

  // Event Bridge State
  private activeRootSegment: string | null = null;
  private activeProjectColor: string | null = null;
  private activeTestimonialIndex: number = 0;
  private testimonialBurst: number = 0;
  
  // Handlers reference for cleanup
  private _handleRootHover: (e: Event) => void;
  private _handleTestimonialActive: (e: Event) => void;

  // Pre-generated structures
  private roots: Branch[] = [];
  private treeBranches: Branch[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not obtain 2D rendering context');
    }
    this.ctx = context;
    this.dust = createDustParticles(150);

    // Bind Event Bridge Handlers
    this._handleRootHover = (e: Event) => {
      const customEvent = e as CustomEvent;
      this.activeRootSegment = customEvent.detail.segmentId;
      this.activeProjectColor = customEvent.detail.color || null;
    };
    
    this._handleTestimonialActive = (e: Event) => {
      const customEvent = e as CustomEvent;
      this.activeTestimonialIndex = customEvent.detail.index;
      this.testimonialBurst = 1.0;
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('root-hover', this._handleRootHover);
      window.addEventListener('testimonial-active', this._handleTestimonialActive);
    }

    this._generateStructures();
    this.resize();
  }

  public destroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('root-hover', this._handleRootHover);
      window.removeEventListener('testimonial-active', this._handleTestimonialActive);
    }
  }

  private _generateStructures() {
    // Roots grow DOWNWARD from center
    this.roots = generateBranches(0, 0, Math.PI / 2, 130, 0, 5, 42);
    // Sort by depth so thicker lines draw first
    this.roots.sort((a, b) => a.depth - b.depth);

    // Tree grows UPWARD from bottom
    this.treeBranches = generateBranches(0, 0, -Math.PI / 2, 140, 0, 5, 77);
    this.treeBranches.sort((a, b) => a.depth - b.depth);
  }

  public resize() {
    if (typeof window === 'undefined') return;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    // Use clientWidth to avoid scrollbar offset on Windows
    this.w = document.documentElement.clientWidth || window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = this.w * this.dpr;
    this.canvas.height = this.h * this.dpr;
    this.canvas.style.width = this.w + 'px';
    this.canvas.style.height = this.h + 'px';
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  // ── Main Draw Loop ──────────────────────────
  public draw(scrollProgress: number, deltaTime: number) {
    this.time += deltaTime;
    // Decay burst
    if (this.testimonialBurst > 0) {
      this.testimonialBurst = Math.max(0, this.testimonialBurst - deltaTime * 1.5);
    }
    
    const ctx = this.ctx;

    // Clear
    ctx.clearRect(0, 0, this.w, this.h);

    // Background gradient
    this._drawBackground(scrollProgress);

    // Ambient dust
    this._drawDust(scrollProgress);

    // Determine section and local progress
    const totalSections = 8;
    const raw = scrollProgress * totalSections;
    const section = Math.min(Math.floor(raw), totalSections - 1);
    const p = clamp(raw - section, 0, 1); // progress within section

    // Draw section visual
    const cx = this.w / 2;
    const cy = this.h / 2;
    const baseSize = Math.min(this.w, this.h) * 0.35;

    switch (section) {
      case 0:
        this._drawHeroLeaf(ctx, cx, cy + 120, baseSize * 1.15, p);
        break;
      case 1:
        this._drawDeconstruction(ctx, cx, cy, baseSize, p);
        break;
      case 2:
        this._drawRoots(ctx, cx, cy, baseSize, p);
        break;
      case 3:
        this._drawSeeds(ctx, cx, cy, baseSize, p);
        break;
      case 4:
        this._drawTree(ctx, cx, cy, baseSize, p);
        break;
      case 5:
        this._drawDataFlow(ctx, cx, cy, baseSize, p);
        break;
      case 6:
        this._drawHarvest(ctx, cx, cy, baseSize, p);
        break;
      case 7:
        this._drawReformation(ctx, cx, cy, baseSize, p);
        break;
    }
  }

  // ═══════════════════════════════════════════
  // BACKGROUND
  // ═══════════════════════════════════════════
  private _drawBackground(progress: number) {
    const ctx = this.ctx;
    const grad = ctx.createRadialGradient(
      this.w / 2,
      this.h / 2,
      0,
      this.w / 2,
      this.h / 2,
      this.w * 0.7
    );

    // Color shifts subtly with scroll
    const goldMix = smoothstep(0.7, 0.9, progress);
    const r = lerp(10, 20, goldMix);
    const g = lerp(15, 18, goldMix);
    const b = lerp(13, 10, goldMix);

    grad.addColorStop(0, `rgb(${Math.round(r + 8)}, ${Math.round(g + 10)}, ${Math.round(b + 6)})`);
    grad.addColorStop(1, `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`);

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.w, this.h);
  }

  // ═══════════════════════════════════════════
  // AMBIENT DUST PARTICLES
  // ═══════════════════════════════════════════
  private _drawDust(progress: number) {
    const ctx = this.ctx;
    const goldMix = smoothstep(0.75, 0.9, progress);

    this.dust.forEach((p) => {
      // Animate
      p.y -= p.speed;
      p.x += p.drift + Math.sin(this.time * 0.5 + p.phase) * 0.00005;
      if (p.y < -0.05) {
        p.y = 1.05;
        p.x = Math.random();
      }
      if (p.x < -0.05 || p.x > 1.05) {
        p.x = Math.random();
        p.y = Math.random();
      }

      const sx = p.x * this.w;
      const sy = p.y * this.h;
      const flicker = 0.7 + Math.sin(this.time * 1.5 + p.phase) * 0.3;
      const alpha = p.opacity * flicker;

      // Color: green → gold based on scroll
      const r = lerp(74, 200, goldMix);
      const g = lerp(222, 165, goldMix);
      const b = lerp(128, 110, goldMix);

      ctx.beginPath();
      ctx.arc(sx, sy, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${alpha})`;
      ctx.fill();
    });
  }

  // ═══════════════════════════════════════════
  // LEAF DRAWING HELPER
  // ═══════════════════════════════════════════
  private _leafPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
    const s = size / 100;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 48 * s);
    ctx.bezierCurveTo(cx - 15 * s, cy - 50 * s, cx - 40 * s, cy - 35 * s, cx - 46 * s, cy - 10 * s);
    ctx.bezierCurveTo(cx - 50 * s, cy + 10 * s, cx - 42 * s, cy + 32 * s, cx - 28 * s, cy + 42 * s);
    ctx.bezierCurveTo(cx - 14 * s, cy + 50 * s, cx, cy + 50 * s, cx, cy + 50 * s);
    ctx.bezierCurveTo(cx, cy + 50 * s, cx + 14 * s, cy + 50 * s, cx + 28 * s, cy + 42 * s);
    ctx.bezierCurveTo(cx + 42 * s, cy + 32 * s, cx + 50 * s, cy + 10 * s, cx + 46 * s, cy - 10 * s);
    ctx.bezierCurveTo(cx + 40 * s, cy - 35 * s, cx + 15 * s, cy - 50 * s, cx, cy - 48 * s);
    ctx.closePath();
  }

  private _drawLeafShape(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number,
    fillOpacity: number,
    strokeColor: string,
    strokeWidth: number
  ) {
    this._leafPath(ctx, cx, cy, size);
    if (fillOpacity > 0) {
      ctx.fillStyle = `rgba(27, 48, 34, ${fillOpacity})`;
      ctx.fill();
    }
    if (strokeWidth > 0) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    }
  }

  private _drawVeins(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number,
    drawProgress: number,
    color = COLORS.glow,
    widthBase = 1.5
  ) {
    const s = size / 100;
    const veins = [
      // Central vein (drawn first, thicker)
      { from: [cx, cy - 32 * s], to: [cx, cy + 38 * s], w: widthBase },
      // Left branches
      { from: [cx, cy - 14 * s], to: [cx - 22 * s, cy + 2 * s], w: widthBase * 0.7 },
      { from: [cx, cy + 4 * s], to: [cx - 28 * s, cy + 20 * s], w: widthBase * 0.7 },
      { from: [cx, cy + 18 * s], to: [cx - 20 * s, cy + 32 * s], w: widthBase * 0.6 },
      // Right branches
      { from: [cx, cy - 14 * s], to: [cx + 22 * s, cy], w: widthBase * 0.7 },
      { from: [cx, cy + 4 * s], to: [cx + 28 * s, cy + 18 * s], w: widthBase * 0.7 },
      { from: [cx, cy + 18 * s], to: [cx + 20 * s, cy + 30 * s], w: widthBase * 0.6 },
    ];

    ctx.lineCap = 'round';
    veins.forEach((v, i) => {
      const delay = i * 0.08;
      const veinP = clamp((drawProgress - delay) / 0.25, 0, 1);
      if (veinP <= 0) return;

      const eased = easeInOutCubic(veinP);
      const ex = lerp(v.from[0], v.to[0], eased);
      const ey = lerp(v.from[1], v.to[1], eased);

      // Glow layer
      ctx.beginPath();
      ctx.moveTo(v.from[0], v.from[1]);
      ctx.lineTo(ex, ey);
      ctx.strokeStyle = color + '30';
      ctx.lineWidth = v.w + 4;
      ctx.stroke();

      // Main line
      ctx.beginPath();
      ctx.moveTo(v.from[0], v.from[1]);
      ctx.lineTo(ex, ey);
      ctx.strokeStyle = color;
      ctx.lineWidth = v.w;
      ctx.stroke();
    });
  }

  // ═══════════════════════════════════════════
  // SECTION 0: HERO — Leaf appears, veins draw
  // ═══════════════════════════════════════════
  private _drawHeroLeaf(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, p: number) {
    // Phase 1 (0-0.25): Outline draws
    const outlineP = smoothstep(0, 0.25, p);
    // Phase 2 (0.2-0.4): Fill fades in
    const fillP = smoothstep(0.2, 0.45, p);
    // Phase 3 (0.3-0.7): Veins draw
    const veinsP = smoothstep(0.3, 0.75, p);
    // Phase 4: Gentle breathing
    const breath = 1 + Math.sin(this.time * 1.2) * 0.012;
    const leafSize = size * breath;

    // Draw outline (partial via dash)
    if (outlineP > 0) {
      ctx.save();
      this._leafPath(ctx, cx, cy, leafSize);
      const totalLen = 800;
      ctx.setLineDash([totalLen * outlineP, totalLen]);
      ctx.strokeStyle = COLORS.sage;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    // Fill
    if (fillP > 0) {
      this._drawLeafShape(ctx, cx, cy, leafSize, fillP * 0.85, 'transparent', 0);
    }

    // Veins
    if (veinsP > 0) {
      this._drawVeins(ctx, cx, cy, leafSize, veinsP, COLORS.glow, 1.5);
    }

    // Outer glow (very subtle)
    if (fillP > 0.5) {
      ctx.save();
      this._leafPath(ctx, cx, cy, leafSize);
      ctx.shadowColor = COLORS.glow;
      ctx.shadowBlur = 30 * fillP;
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.08)';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
    }
  }

  // ═══════════════════════════════════════════
  // SECTION 1: DECONSTRUCTION — Veins extend outward
  // ═══════════════════════════════════════════
  private _drawDeconstruction(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, p: number) {
    const eased = easeInOutCubic(p);

    // Leaf body fades
    const bodyAlpha = (1 - smoothstep(0, 0.5, p)) * 0.85;
    const bodyScale = 1 + eased * 0.3;

    if (bodyAlpha > 0.01) {
      this._drawLeafShape(ctx, cx, cy, size * bodyScale, bodyAlpha, 'transparent', 0);
    }

    // Veins extend outward and fade
    const s = size / 100;
    const veinAlpha = 1 - smoothstep(0.5, 1, p);
    const extend = 1 + eased * 2.5;

    if (veinAlpha > 0.01) {
      const veins = [
        { from: [cx, cy - 32 * s], to: [cx, cy - 32 * s - 38 * s * extend] },
        { from: [cx, cy - 14 * s], to: [cx - 22 * s * extend, cy + 2 * s - 14 * s * eased] },
        { from: [cx, cy + 4 * s], to: [cx - 28 * s * extend, cy + 20 * s - 8 * s * eased] },
        { from: [cx, cy + 18 * s], to: [cx - 20 * s * extend, cy + 32 * s + 5 * s * eased] },
        { from: [cx, cy - 14 * s], to: [cx + 22 * s * extend, cy - 2 * s * eased] },
        { from: [cx, cy + 4 * s], to: [cx + 28 * s * extend, cy + 18 * s - 5 * s * eased] },
        { from: [cx, cy + 18 * s], to: [cx + 20 * s * extend, cy + 30 * s + 8 * s * eased] },
      ];

      ctx.lineCap = 'round';
      veins.forEach((v, i) => {
        ctx.beginPath();
        ctx.moveTo(v.from[0], v.from[1]);
        ctx.lineTo(v.to[0], v.to[1]);

        // Glow
        ctx.strokeStyle = `rgba(74, 222, 128, ${veinAlpha * 0.15})`;
        ctx.lineWidth = 5;
        ctx.stroke();
        // Line
        ctx.strokeStyle = `rgba(74, 222, 128, ${veinAlpha * 0.8})`;
        ctx.lineWidth = i === 0 ? 1.5 : 1;
        ctx.stroke();
      });
    }

    // Trailing dots from vein tips
    if (p > 0.3) {
      const dotP = smoothstep(0.3, 1, p);
      const dotAlpha = (1 - smoothstep(0.7, 1, p)) * 0.6;
      for (let i = 0; i < 15; i++) {
        const angle = (i / 15) * Math.PI * 2;
        const dist = (50 + i * 18) * s * dotP;
        const dx = cx + Math.cos(angle + this.time * 0.1) * dist;
        const dy = cy + Math.sin(angle + this.time * 0.08) * dist * 0.7;
        ctx.beginPath();
        ctx.arc(dx, dy, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(74, 222, 128, ${dotAlpha * (0.3 + Math.sin(i + this.time) * 0.2)})`;
        ctx.fill();
      }
    }
  }

  // ═══════════════════════════════════════════
  // SECTION 2: ROOTS — Network grows downward
  // ═══════════════════════════════════════════
  private _drawRoots(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, p: number) {
    const drawP = smoothstep(0, 0.75, p);
    const scale = size / 180;

    ctx.save();
    ctx.translate(cx, cy - size * 0.3);
    ctx.scale(scale, scale);

    // Draw root branches with progressive reveal
    const totalRoots = this.roots.length;
    ctx.lineCap = 'round';

    this.roots.forEach((branch, i) => {
      const branchStart = (i / totalRoots) * 0.7;
      const branchEnd = branchStart + 0.35;
      const branchP = clamp((drawP - branchStart) / (branchEnd - branchStart), 0, 1);
      if (branchP <= 0) return;

      const eased = easeInOutCubic(branchP);
      const ex = lerp(branch.start[0], branch.end[0], eased);
      const ey = lerp(branch.start[1], branch.end[1], eased);

      const alpha = 0.9 - branch.depth * 0.12;

      // Glow
      ctx.beginPath();
      ctx.moveTo(branch.start[0], branch.start[1]);
      ctx.lineTo(ex, ey);
      ctx.strokeStyle = `rgba(152, 169, 154, ${alpha * 0.2})`;
      ctx.lineWidth = branch.thickness + 3;
      ctx.stroke();

      // Main line
      ctx.beginPath();
      ctx.moveTo(branch.start[0], branch.start[1]);
      ctx.lineTo(ex, ey);
      ctx.strokeStyle = `rgba(152, 169, 154, ${alpha})`;
      ctx.lineWidth = branch.thickness;
      ctx.stroke();
    });

    // Glowing nodes at branch points
    if (drawP > 0.3) {
      const nodePulse = 0.5 + Math.sin(this.time * 2) * 0.3;
      const nodeAlpha = smoothstep(0.3, 0.6, drawP);

      this.roots.forEach((branch, i) => {
        if (branch.depth < 3 && i % 3 === 0) {
          const branchDone = clamp((drawP - (i / this.roots.length) * 0.7) / 0.35, 0, 1);
          if (branchDone >= 1) {
            ctx.beginPath();
            ctx.arc(branch.end[0], branch.end[1], 3 + nodePulse, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(74, 222, 128, ${nodeAlpha * 0.6 * nodePulse})`;
            ctx.fill();
          }
        }
      });
    }

    ctx.restore();
  }

  // ═══════════════════════════════════════════
  // SECTION 3: SEEDS — Three leaf shapes
  // ═══════════════════════════════════════════
  private _drawSeeds(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, p: number) {
    const appearP = smoothstep(0, 0.4, p);
    const spacing = size * 1.1;
    const sizes = [size * 0.45, size * 0.55, size * 0.65];
    const offsets = [-spacing, 0, spacing];

    sizes.forEach((s, i) => {
      const delay = i * 0.12;
      const seedP = clamp((appearP - delay) / 0.6, 0, 1);
      if (seedP <= 0) return;

      const eased = easeInOutCubic(seedP);
      const sx = cx + offsets[i];
      const sy = cy;
      const currentSize = s * eased;
      const alpha = eased;

      // Floating motion
      const float = Math.sin(this.time * 0.8 + i * 1.5) * 5;

      ctx.save();
      ctx.globalAlpha = alpha;

      // Leaf shape
      this._drawLeafShape(ctx, sx, sy + float, currentSize, 0.8, COLORS.sage, 1.2);

      // Veins
      const veinP = clamp((seedP - 0.3) / 0.5, 0, 1);
      if (veinP > 0) {
        this._drawVeins(ctx, sx, sy + float, currentSize, veinP, i === 2 ? COLORS.glow : COLORS.sage, 1);
      }

      const planIds = ['essencial', 'profissional', 'experience'];
      const isActive = this.activeRootSegment === planIds[i];

      // Glow for active plan, or inherently for Experience if no other is active
      const shouldGlow = isActive || (i === 2 && seedP > 0.5 && !this.activeRootSegment);

      if (shouldGlow) {
        ctx.save();
        this._leafPath(ctx, sx, sy + float, currentSize);
        ctx.shadowColor = COLORS.glow;
        ctx.shadowBlur = isActive ? 30 : 20;
        ctx.strokeStyle = isActive ? `rgba(74, 222, 128, 0.4)` : `rgba(74, 222, 128, 0.15)`;
        ctx.lineWidth = isActive ? 3 : 2;
        ctx.stroke();
        ctx.restore();
      }

      ctx.globalAlpha = 1;
      ctx.restore();
    });
  }

  // ═══════════════════════════════════════════
  // SECTION 4: TREE — Grows upward
  // ═══════════════════════════════════════════
  private _drawTree(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, p: number) {
    const drawP = smoothstep(0, 0.7, p);
    const scale = size / 180;

    ctx.save();
    ctx.translate(cx, cy + size * 0.85);
    ctx.scale(scale, scale);
    ctx.lineCap = 'round';

    const totalBranches = this.treeBranches.length;

    this.treeBranches.forEach((branch, i) => {
      const branchStart = (i / totalBranches) * 0.65;
      const branchEnd = branchStart + 0.4;
      const branchP = clamp((drawP - branchStart) / (branchEnd - branchStart), 0, 1);
      if (branchP <= 0) return;

      const eased = easeInOutCubic(branchP);
      const ex = lerp(branch.start[0], branch.end[0], eased);
      const ey = lerp(branch.start[1], branch.end[1], eased);

      const alpha = 0.9 - branch.depth * 0.1;
      const isDeep = branch.depth >= 3;

      // Glow
      ctx.beginPath();
      ctx.moveTo(branch.start[0], branch.start[1]);
      ctx.lineTo(ex, ey);
      ctx.strokeStyle = `rgba(152, 169, 154, ${alpha * 0.15})`;
      ctx.lineWidth = branch.thickness + 3;
      ctx.stroke();

      // Main
      ctx.beginPath();
      ctx.moveTo(branch.start[0], branch.start[1]);
      ctx.lineTo(ex, ey);
      ctx.strokeStyle = isDeep ? `rgba(152, 169, 154, ${alpha})` : `rgba(27, 48, 34, ${alpha})`;
      ctx.lineWidth = branch.thickness;
      ctx.stroke();
    });

    // Mini leaves at branch tips (depth >= 4)
    if (drawP > 0.5) {
      const leafP = smoothstep(0.5, 0.85, drawP);
      this.treeBranches.forEach((branch, i) => {
        if (branch.depth >= 4) {
          const bDone = clamp((drawP - (i / totalBranches) * 0.65) / 0.4, 0, 1);
          if (bDone >= 0.8) {
            const ls = 12 * leafP;
            const float = Math.sin(this.time + i) * 2;
            ctx.save();
            ctx.globalAlpha = leafP * 0.8;
            this._drawLeafShape(ctx, branch.end[0], branch.end[1] + float, ls, 0.7, COLORS.sage, 0.5);
            ctx.globalAlpha = 1;
            ctx.restore();
          }
        }
      });
    }

    ctx.restore();
  }

  // ═══════════════════════════════════════════
  // SECTION 5: DATA FLOW — Pulses along tree
  // ═══════════════════════════════════════════
  private _drawDataFlow(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, p: number) {
    const scale = size / 180;

    ctx.save();
    ctx.translate(cx, cy + size * 0.85);
    ctx.scale(scale, scale);
    ctx.lineCap = 'round';

    // Draw full tree (static)
    this.treeBranches.forEach((branch) => {
      const alpha = 0.5 - branch.depth * 0.06;
      ctx.beginPath();
      ctx.moveTo(branch.start[0], branch.start[1]);
      ctx.lineTo(branch.end[0], branch.end[1]);
      ctx.strokeStyle = `rgba(152, 169, 154, ${Math.max(alpha, 0.15)})`;
      ctx.lineWidth = branch.thickness;
      ctx.stroke();
    });

    // Animated pulses traveling along branches
    const pulseInterval = 2.5; // seconds between pulses
    const pulseSpeed = 0.8;
    const pulseTime = this.time % pulseInterval;
    const pulseProgress = pulseTime / pulseInterval;

    this.treeBranches.forEach((branch) => {
      // Pulse travels from root to tips
      const branchDelay = branch.depth * 0.15;
      const localPulse = (pulseProgress - branchDelay + 1) % 1;

      if (localPulse > 0 && localPulse < pulseSpeed) {
        const t = localPulse / pulseSpeed;
        const px = lerp(branch.start[0], branch.end[0], t);
        const py = lerp(branch.start[1], branch.end[1], t);
        
        // Intensify with testimonial burst
        const burstMultiplier = 1 + (this.testimonialBurst * 1.5);
        const pulseSize = (4 - branch.depth * 0.5) * burstMultiplier;
        const pulseAlpha = Math.sin(t * Math.PI) * (0.9 + this.testimonialBurst);

          if (pulseSize > 0.5) {
            let rgb = 'rgba(74, 222, 128'; // Default Emerald
            
            // If there's an active project hovered, use its color
            if (this.activeProjectColor) {
              // activeProjectColor comes as hex like #10b981
              // We need to just inject it if possible, but let's assume it's hex, so we'll just use it directly for pulse glow.
            } else if (this.activeTestimonialIndex !== undefined) {
              // Choose color based on testimonial index
              const colors = [
                'rgba(74, 222, 128', // Emerald
                'rgba(56, 189, 248', // Sky
                'rgba(250, 204, 21'  // Yellow
              ];
              rgb = colors[this.activeTestimonialIndex % colors.length];
            }

            const fillStyleGlow = this.activeProjectColor 
              ? `${this.activeProjectColor}${Math.floor(pulseAlpha * 0.2 * 255).toString(16).padStart(2,'0')}`
              : `${rgb}, ${pulseAlpha * 0.2})`;

            const fillStyleCore = this.activeProjectColor
              ? `${this.activeProjectColor}${Math.floor(pulseAlpha * 255).toString(16).padStart(2,'0')}`
              : `${rgb}, ${pulseAlpha})`;

            // Glow
            ctx.beginPath();
            ctx.arc(px, py, pulseSize + 4, 0, Math.PI * 2);
            ctx.fillStyle = fillStyleGlow;
            ctx.fill();
            // Core
            ctx.beginPath();
            ctx.arc(px, py, pulseSize, 0, Math.PI * 2);
            ctx.fillStyle = fillStyleCore;
            ctx.fill();
          }
      }
    });

    // Mini leaves at tips
    this.treeBranches.forEach((branch, i) => {
      if (branch.depth >= 4) {
        const float = Math.sin(this.time * 0.7 + i) * 2;
        ctx.save();
        ctx.globalAlpha = 0.6;
        this._drawLeafShape(ctx, branch.end[0], branch.end[1] + float, 12, 0.6, COLORS.sage, 0.5);
        ctx.globalAlpha = 1;
        ctx.restore();
      }
    });

    ctx.restore();
  }

  // ═══════════════════════════════════════════
  // SECTION 6: HARVEST — Tree turns golden
  // ═══════════════════════════════════════════
  private _drawHarvest(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, p: number) {
    const goldP = smoothstep(0, 0.6, p);
    const scale = size / 180;

    ctx.save();
    ctx.translate(cx, cy + size * 0.85);
    ctx.scale(scale, scale);
    ctx.lineCap = 'round';

    // Tree transitioning to gold
    this.treeBranches.forEach((branch) => {
      const alpha = 0.7 - branch.depth * 0.08;
      const r = lerp(152, 200, goldP);
      const g = lerp(169, 165, goldP);
      const b = lerp(154, 110, goldP);

      ctx.beginPath();
      ctx.moveTo(branch.start[0], branch.start[1]);
      ctx.lineTo(branch.end[0], branch.end[1]);
      ctx.strokeStyle = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${Math.max(alpha, 0.2)})`;
      ctx.lineWidth = branch.thickness;
      ctx.stroke();
    });

    // Golden leaves + floating golden particles
    this.treeBranches.forEach((branch, i) => {
      if (branch.depth >= 4) {
        const float = Math.sin(this.time * 0.7 + i) * 2;
        const rise = goldP * i * 0.8;
        ctx.save();
        ctx.globalAlpha = 0.8;
        this._drawLeafShape(
          ctx,
          branch.end[0],
          branch.end[1] + float - rise,
          12,
          0.7,
          `rgba(200, 169, 110, ${0.6 + goldP * 0.4})`,
          0.5
        );
        ctx.globalAlpha = 1;
        ctx.restore();
      }
    });

    // Rising golden particles
    if (goldP > 0.3) {
      const riseP = smoothstep(0.3, 1, goldP);
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        const baseR = 40 + i * 8;
        const x = Math.cos(angle + this.time * 0.2) * baseR;
        const y = -80 - riseP * i * 12 + Math.sin(this.time * 0.5 + i) * 5;
        const alpha = riseP * (0.3 + Math.sin(i + this.time) * 0.15);

        ctx.beginPath();
        ctx.arc(x, y, 2 + Math.sin(i) * 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 169, 110, ${alpha})`;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 169, 110, ${alpha * 0.2})`;
        ctx.fill();
      }
    }

    ctx.restore();
  }

  // ═══════════════════════════════════════════
  // SECTION 7: REFORMATION — Leaf reforms
  // ═══════════════════════════════════════════
  private _drawReformation(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, p: number) {
    const reformP = smoothstep(0.1, 0.7, p);
    const eased = easeInOutCubic(reformP);

    // Converging dots (golden → green)
    if (reformP < 0.9) {
      const dotCount = 24;
      for (let i = 0; i < dotCount; i++) {
        const angle = (i / dotCount) * Math.PI * 2;
        const maxDist = size * 1.5;
        const dist = maxDist * (1 - eased);
        const dx = cx + Math.cos(angle + this.time * 0.1 + i * 0.2) * dist;
        const dy = cy + Math.sin(angle + this.time * 0.08 + i * 0.3) * dist * 0.7;
        const alpha = (1 - smoothstep(0.7, 1, reformP)) * 0.5;

        const gr = lerp(200, 74, eased);
        const gg = lerp(165, 222, eased);
        const gb = lerp(110, 128, eased);

        ctx.beginPath();
        ctx.arc(dx, dy, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${Math.round(gr)}, ${Math.round(gg)}, ${Math.round(gb)}, ${alpha})`;
        ctx.fill();
      }
    }

    // Leaf reforms
    if (reformP > 0.2) {
      const leafAlpha = smoothstep(0.2, 0.6, reformP) * 0.85;
      const leafScale = 0.5 + eased * 0.5;
      const breath = 1 + Math.sin(this.time * 1.2) * 0.01;

      this._drawLeafShape(ctx, cx, cy, size * leafScale * breath, leafAlpha, COLORS.sage, 1.2);

      // Veins
      const veinsP = smoothstep(0.4, 0.8, reformP);
      if (veinsP > 0) {
        this._drawVeins(ctx, cx, cy, size * leafScale * breath, veinsP, COLORS.glow, 1.5);
      }
    }
  }
}
