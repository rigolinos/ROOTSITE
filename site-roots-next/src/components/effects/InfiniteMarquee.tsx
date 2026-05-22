'use client';

import { useRef, useEffect } from 'react';
import { useLenis } from '@/hooks/useLenis';

interface InfiniteMarqueeProps {
  text?: string;
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
}

/**
 * Infinite Marquee — horizontal running text.
 * Reverses direction based on Lenis scroll velocity.
 */
export default function InfiniteMarquee({
  text = 'EFICIÊNCIA SILENCIOSA • ROOT CODE • CULTIVANDO ECOSSISTEMAS DIGITAIS •',
  speed = 1,
  direction = 'left',
  className = '',
}: InfiniteMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const scrollVelocity = useRef(0);

  useEffect(() => {
    if (!lenis) return;

    const handleScroll = () => {
      scrollVelocity.current = lenis.velocity;
    };

    lenis.on('scroll', handleScroll);

    return () => {
      lenis.off('scroll', handleScroll);
    };
  }, [lenis]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let position = 0;
    let animId: number;

    const baseSpeed = direction === 'left' ? -speed : speed;

    const animate = () => {
      // Adjust speed based on scroll velocity
      const velocityBoost = scrollVelocity.current * 0.05;
      const currentSpeed = baseSpeed * 0.5 + velocityBoost;

      position += currentSpeed;

      // Reset position seamlessly
      const trackWidth = track.scrollWidth / 2;
      if (Math.abs(position) >= trackWidth) {
        position = 0;
      }

      track.style.transform = `translateX(${position}px)`;
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animId);
  }, [speed, direction]);

  // Repeat text 4 times for seamless loop
  const repeatedText = Array(4).fill(text).join(' ');

  return (
    <div className={`overflow-hidden py-10 md:py-16 ${className}`} aria-hidden="true">
      <div
        ref={trackRef}
        className="flex whitespace-nowrap will-change-transform"
        style={{
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          fontWeight: 800,
          color: 'rgba(255, 255, 255, 0.04)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
      >
        <span className="inline-block pr-8">{repeatedText}</span>
        <span className="inline-block pr-8">{repeatedText}</span>
      </div>
    </div>
  );
}
