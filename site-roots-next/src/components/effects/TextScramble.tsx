'use client';

import { useEffect, useState, useRef } from 'react';

interface TextScrambleProps {
  text: string;
  delay?: number;
  className?: string;
}

const CHARS = '!<>-_\\/[]{}—=+*^?#________';

export default function TextScramble({ text, delay = 0, className = '' }: TextScrambleProps) {
  const [displayText, setDisplayText] = useState('');
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;

    let timeout: ReturnType<typeof setTimeout>;
    let frameId: number;

    const startAnimation = () => {
      hasRun.current = true;
      let frame = 0;
      const length = text.length;
      const queue: { from: string; to: string; start: number; end: number; char?: string }[] = [];

      for (let i = 0; i < length; i++) {
        const from = CHARS[Math.floor(Math.random() * CHARS.length)];
        const to = text[i] || '';
        const start = Math.floor(Math.random() * 40);
        const end = start + Math.floor(Math.random() * 40);
        queue.push({ from, to, start, end });
      }

      const update = () => {
        let output = '';
        let complete = 0;

        for (let i = 0; i < length; i++) {
          let { from, to, start, end, char } = queue[i];
          if (frame >= end) {
            complete++;
            output += to;
          } else if (frame >= start) {
            if (!char || Math.random() < 0.28) {
              char = CHARS[Math.floor(Math.random() * CHARS.length)];
              queue[i].char = char;
            }
            output += char;
          } else {
            output += from;
          }
        }

        setDisplayText(output);

        if (complete === length) {
          cancelAnimationFrame(frameId);
        } else {
          frameId = requestAnimationFrame(update);
          frame++;
        }
      };

      update();
    };

    timeout = setTimeout(startAnimation, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frameId);
    };
  }, [text, delay]);

  return <span className={className}>{displayText}</span>;
}
