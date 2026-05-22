// ============================================
// Root Code — Canvas 2D Visual Engine
// Crisp, recognizable shapes: leaf, veins, roots, tree
// ============================================

import { lerp, clamp, smoothstep, easeInOutCubic } from './utils.js';

// ── Brand Colors ────────────────────────────────
const COLORS = {
    forest:    '#1B3022',
    sage:      '#98A99A',
    glow:      '#4ADE80',
    gold:      '#C8A96E',
    goldLight: '#E8D5A8',
    white:     '#FFFFFF',
    bgDark:    '#0A0F0D',
    bgMid:     '#0F1A13',
};

// ── Ambient Particle Pool ───────────────────────
function createDustParticles(count) {
    const particles = [];
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
function generateBranches(startX, startY, angle, length, depth, maxDepth, seed) {
    if (depth > maxDepth || length < 8) return [];

    const endX = startX + Math.cos(angle) * length;
    const endY = startY + Math.sin(angle) * length;
    const thickness = Math.max(0.5, 2.5 - depth * 0.4);

    const branch = { 
        start: [startX, startY], 
        end: [endX, endY], 
        depth, 
        thickness,
        length: Math.sqrt((endX-startX)**2 + (endY-startY)**2)
    };

    const children = [];
    const rng = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    };

    if (depth < maxDepth) {
        const spread = 0.35 + rng() * 0.3;
        const shrink = 0.62 + rng() * 0.13;
        children.push(...generateBranches(endX, endY, angle - spread, length * shrink, depth + 1, maxDepth, seed + 1));
        children.push(...generateBranches(endX, endY, angle + spread, length * shrink, depth + 1, maxDepth, seed + 2));
        if (rng() > 0.55) {
            children.push(...generateBranches(endX, endY, angle + (rng()-0.5)*0.2, length * shrink * 0.7, depth + 1, maxDepth, seed + 3));
        }
    }
    return [branch, ...children];
}


export class VisualEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.w = 0;
        this.h = 0;
        this.dpr = 1;
        this.dust = createDustParticles(120);
        this.time = 0;

        // Pre-generate root and tree structures
        this.roots = [];
        this.treeBranches = [];
        this._generateStructures();

        this.resize();
    }

    _generateStructures() {
        // Roots grow DOWNWARD from center
        this.roots = generateBranches(0, 0, Math.PI / 2, 130, 0, 5, 42);
        // Sort by depth so thicker lines draw first
        this.roots.sort((a, b) => a.depth - b.depth);

        // Tree grows UPWARD from bottom
        this.treeBranches = generateBranches(0, 0, -Math.PI / 2, 140, 0, 5, 77);
        this.treeBranches.sort((a, b) => a.depth - b.depth);
    }

    resize() {
        this.dpr = Math.min(window.devicePixelRatio, 2);
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.canvas.width = this.w * this.dpr;
        this.canvas.height = this.h * this.dpr;
        this.canvas.style.width = this.w + 'px';
        this.canvas.style.height = this.h + 'px';
        this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }

    // ── Main Draw Loop ──────────────────────────
    draw(scrollProgress, deltaTime) {
        this.time += deltaTime;
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
            case 0: this._drawHeroLeaf(ctx, cx, cy, baseSize, p); break;
            case 1: this._drawDeconstruction(ctx, cx, cy, baseSize, p); break;
            case 2: this._drawRoots(ctx, cx, cy, baseSize, p); break;
            case 3: this._drawSeeds(ctx, cx, cy, baseSize, p); break;
            case 4: this._drawTree(ctx, cx, cy, baseSize, p); break;
            case 5: this._drawDataFlow(ctx, cx, cy, baseSize, p); break;
            case 6: this._drawHarvest(ctx, cx, cy, baseSize, p); break;
            case 7: this._drawReformation(ctx, cx, cy, baseSize, p); break;
        }
    }

    // ═══════════════════════════════════════════
    // BACKGROUND
    // ═══════════════════════════════════════════
    _drawBackground(progress) {
        const ctx = this.ctx;
        // Radial gradient: slightly lighter center
        const grad = ctx.createRadialGradient(
            this.w/2, this.h/2, 0,
            this.w/2, this.h/2, this.w * 0.7
        );

        // Color shifts subtly with scroll
        const goldMix = smoothstep(0.7, 0.9, progress);
        const r = lerp(10, 20, goldMix);
        const g = lerp(15, 18, goldMix);
        const b = lerp(13, 10, goldMix);

        grad.addColorStop(0, `rgb(${r+8}, ${g+10}, ${b+6})`);
        grad.addColorStop(1, `rgb(${r}, ${g}, ${b})`);

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, this.w, this.h);
    }

    // ═══════════════════════════════════════════
    // AMBIENT DUST PARTICLES
    // ═══════════════════════════════════════════
    _drawDust(progress) {
        const ctx = this.ctx;
        const goldMix = smoothstep(0.75, 0.9, progress);

        this.dust.forEach(p => {
            // Animate
            p.y -= p.speed;
            p.x += p.drift + Math.sin(this.time * 0.5 + p.phase) * 0.00005;
            if (p.y < -0.05) { p.y = 1.05; p.x = Math.random(); }
            if (p.x < -0.05 || p.x > 1.05) { p.x = Math.random(); p.y = Math.random(); }

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
            ctx.fillStyle = `rgba(${r|0}, ${g|0}, ${b|0}, ${alpha})`;
            ctx.fill();
        });
    }

    // ═══════════════════════════════════════════
    // LEAF DRAWING HELPER
    // ═══════════════════════════════════════════
    _leafPath(ctx, cx, cy, size) {
        const s = size / 100;
        ctx.beginPath();
        ctx.moveTo(cx, cy - 48 * s);
        ctx.bezierCurveTo(cx - 15*s, cy - 50*s, cx - 40*s, cy - 35*s, cx - 46*s, cy - 10*s);
        ctx.bezierCurveTo(cx - 50*s, cy + 10*s, cx - 42*s, cy + 32*s, cx - 28*s, cy + 42*s);
        ctx.bezierCurveTo(cx - 14*s, cy + 50*s, cx, cy + 50*s, cx, cy + 50*s);
        ctx.bezierCurveTo(cx, cy + 50*s, cx + 14*s, cy + 50*s, cx + 28*s, cy + 42*s);
        ctx.bezierCurveTo(cx + 42*s, cy + 32*s, cx + 50*s, cy + 10*s, cx + 46*s, cy - 10*s);
        ctx.bezierCurveTo(cx + 40*s, cy - 35*s, cx + 15*s, cy - 50*s, cx, cy - 48*s);
        ctx.closePath();
    }

    _drawLeafShape(ctx, cx, cy, size, fillOpacity, strokeColor, strokeWidth) {
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

    _drawVeins(ctx, cx, cy, size, drawProgress, color = COLORS.glow, widthBase = 1.5) {
        const s = size / 100;
        const veins = [
            // Central vein (drawn first, thicker)
            { from: [cx, cy - 32*s], to: [cx, cy + 38*s], w: widthBase },
            // Left branches
            { from: [cx, cy - 14*s], to: [cx - 22*s, cy + 2*s], w: widthBase * 0.7 },
            { from: [cx, cy + 4*s],  to: [cx - 28*s, cy + 20*s], w: widthBase * 0.7 },
            { from: [cx, cy + 18*s], to: [cx - 20*s, cy + 32*s], w: widthBase * 0.6 },
            // Right branches
            { from: [cx, cy - 14*s], to: [cx + 22*s, cy], w: widthBase * 0.7 },
            { from: [cx, cy + 4*s],  to: [cx + 28*s, cy + 18*s], w: widthBase * 0.7 },
            { from: [cx, cy + 18*s], to: [cx + 20*s, cy + 30*s], w: widthBase * 0.6 },
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
    _drawHeroLeaf(ctx, cx, cy, size, p) {
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
    _drawDeconstruction(ctx, cx, cy, size, p) {
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
                { from: [cx, cy - 32*s], to: [cx, cy - 32*s - 38*s*extend], angle: -Math.PI/2 },
                { from: [cx, cy - 14*s], to: [cx - 22*s*extend, cy + 2*s - 14*s*eased], angle: -2.3 },
                { from: [cx, cy + 4*s], to: [cx - 28*s*extend, cy + 20*s - 8*s*eased], angle: -2.6 },
                { from: [cx, cy + 18*s], to: [cx - 20*s*extend, cy + 32*s + 5*s*eased], angle: -2.8 },
                { from: [cx, cy - 14*s], to: [cx + 22*s*extend, cy - 2*s*eased], angle: -0.8 },
                { from: [cx, cy + 4*s], to: [cx + 28*s*extend, cy + 18*s - 5*s*eased], angle: -0.5 },
                { from: [cx, cy + 18*s], to: [cx + 20*s*extend, cy + 30*s + 8*s*eased], angle: -0.3 },
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
    _drawRoots(ctx, cx, cy, size, p) {
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
                    const branchDone = clamp((drawP - (i/this.roots.length)*0.7) / 0.35, 0, 1);
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
    _drawSeeds(ctx, cx, cy, size, p) {
        const appearP = smoothstep(0, 0.4, p);
        const spacing = size * 1.1;
        const sizes = [size * 0.45, size * 0.55, size * 0.65];
        const labels = ['Essencial', 'Profissional', 'Experience'];
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
                this._drawVeins(ctx, sx, sy + float, currentSize, veinP, 
                    i === 2 ? COLORS.glow : COLORS.sage, 1);
            }

            // Glow for Experience (premium)
            if (i === 2 && seedP > 0.5) {
                ctx.save();
                this._leafPath(ctx, sx, sy + float, currentSize);
                ctx.shadowColor = COLORS.glow;
                ctx.shadowBlur = 20;
                ctx.strokeStyle = `rgba(74, 222, 128, 0.15)`;
                ctx.lineWidth = 2;
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
    _drawTree(ctx, cx, cy, size, p) {
        const drawP = smoothstep(0, 0.7, p);
        const scale = size / 180;

        ctx.save();
        ctx.translate(cx, cy + size * 0.5);
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
            const color = isDeep ? COLORS.sage : COLORS.forest;

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
            ctx.strokeStyle = isDeep 
                ? `rgba(152, 169, 154, ${alpha})`
                : `rgba(27, 48, 34, ${alpha})`;
            ctx.lineWidth = branch.thickness;
            ctx.stroke();
        });

        // Mini leaves at branch tips (depth >= 4)
        if (drawP > 0.5) {
            const leafP = smoothstep(0.5, 0.85, drawP);
            this.treeBranches.forEach((branch, i) => {
                if (branch.depth >= 4) {
                    const bDone = clamp((drawP - (i/totalBranches)*0.65) / 0.4, 0, 1);
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
    _drawDataFlow(ctx, cx, cy, size, p) {
        const scale = size / 180;

        ctx.save();
        ctx.translate(cx, cy + size * 0.5);
        ctx.scale(scale, scale);
        ctx.lineCap = 'round';

        // Draw full tree (static)
        this.treeBranches.forEach(branch => {
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

        this.treeBranches.forEach((branch, i) => {
            // Pulse travels from root to tips
            const branchDelay = branch.depth * 0.15;
            const localPulse = (pulseProgress - branchDelay + 1) % 1;

            if (localPulse > 0 && localPulse < pulseSpeed) {
                const t = localPulse / pulseSpeed;
                const px = lerp(branch.start[0], branch.end[0], t);
                const py = lerp(branch.start[1], branch.end[1], t);
                const pulseSize = 4 - branch.depth * 0.5;
                const pulseAlpha = Math.sin(t * Math.PI) * 0.9;

                if (pulseSize > 0.5) {
                    // Glow
                    ctx.beginPath();
                    ctx.arc(px, py, pulseSize + 4, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(74, 222, 128, ${pulseAlpha * 0.2})`;
                    ctx.fill();
                    // Core
                    ctx.beginPath();
                    ctx.arc(px, py, pulseSize, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(74, 222, 128, ${pulseAlpha})`;
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
    _drawHarvest(ctx, cx, cy, size, p) {
        const goldP = smoothstep(0, 0.6, p);
        const scale = size / 180;

        ctx.save();
        ctx.translate(cx, cy + size * 0.5);
        ctx.scale(scale, scale);
        ctx.lineCap = 'round';

        // Tree transitioning to gold
        this.treeBranches.forEach(branch => {
            const alpha = 0.7 - branch.depth * 0.08;
            const r = lerp(152, 200, goldP);
            const g = lerp(169, 165, goldP);
            const b = lerp(154, 110, goldP);

            ctx.beginPath();
            ctx.moveTo(branch.start[0], branch.start[1]);
            ctx.lineTo(branch.end[0], branch.end[1]);
            ctx.strokeStyle = `rgba(${r|0}, ${g|0}, ${b|0}, ${Math.max(alpha, 0.2)})`;
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
                this._drawLeafShape(ctx, branch.end[0], branch.end[1] + float - rise, 12, 0.7, 
                    `rgba(200, 169, 110, ${0.6 + goldP * 0.4})`, 0.5);
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
    _drawReformation(ctx, cx, cy, size, p) {
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
                ctx.fillStyle = `rgba(${gr|0}, ${gg|0}, ${gb|0}, ${alpha})`;
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
