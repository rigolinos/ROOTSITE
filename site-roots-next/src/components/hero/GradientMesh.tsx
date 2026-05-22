'use client';

import { useEffect, useRef } from 'react';

/**
 * Animated Gradient Mesh Background
 * Organic dark blobs moving slowly — inspired by Linear/Stripe.
 * Creates atmospheric depth without a video file.
 */
export default function GradientMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const blobs = [
      { x: 0.3, y: 0.3, r: 0.4, color: 'rgba(27, 48, 34, 0.8)', vx: 0.0003, vy: 0.0002, phase: 0 },
      { x: 0.7, y: 0.6, r: 0.35, color: 'rgba(15, 26, 19, 0.9)', vx: -0.0002, vy: 0.0003, phase: 1.5 },
      { x: 0.5, y: 0.8, r: 0.45, color: 'rgba(10, 15, 13, 0.95)', vx: 0.0001, vy: -0.0002, phase: 3 },
      { x: 0.2, y: 0.7, r: 0.3, color: 'rgba(74, 222, 128, 0.025)', vx: 0.0004, vy: 0.0001, phase: 4.5 },
      { x: 0.8, y: 0.2, r: 0.35, color: 'rgba(152, 169, 154, 0.04)', vx: -0.0003, vy: -0.0002, phase: 2 },
      { x: 0.5, y: 0.4, r: 0.5, color: 'rgba(27, 48, 34, 0.6)', vx: 0.0002, vy: -0.0001, phase: 5 },
    ];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      time += 0.008;
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      // Base dark fill
      ctx.fillStyle = '#0A0F0D';
      ctx.fillRect(0, 0, w, h);

      blobs.forEach((blob) => {
        const bx = (blob.x + Math.sin(time * 0.5 + blob.phase) * 0.08) * w;
        const by = (blob.y + Math.cos(time * 0.4 + blob.phase) * 0.06) * h;
        const br = blob.r * Math.max(w, h);

        const grad = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        grad.addColorStop(0, blob.color);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      });

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 will-change-transform"
      style={{ filter: 'blur(80px)' }}
      aria-hidden="true"
    />
  );
}
