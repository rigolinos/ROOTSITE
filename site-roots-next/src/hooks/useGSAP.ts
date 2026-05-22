'use client';

import { useRef, useEffect, useCallback } from 'react';
import { gsap } from '@/lib/gsap-register';

/**
 * Custom hook for GSAP animations with automatic cleanup.
 * Creates a gsap.context() scoped to the provided ref.
 */
export function useGSAP(
  callback: (ctx: gsap.Context) => void,
  scope: React.RefObject<HTMLElement | null>,
  deps: React.DependencyList = []
) {
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    if (!scope.current) return;

    ctxRef.current = gsap.context(() => {
      callback(ctxRef.current!);
    }, scope.current);

    return () => {
      ctxRef.current?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope, ...deps]);

  return ctxRef;
}
