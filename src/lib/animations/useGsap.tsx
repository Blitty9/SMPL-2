import { useEffect, useRef, MutableRefObject } from 'react';
import { gsap, ScrollTrigger } from './gsap';

type UseGsapCallback = (context: gsap.Context) => void | (() => void);

interface UseGsapOptions {
  scope?: MutableRefObject<HTMLElement | null>;
  dependencies?: unknown[];
  revertOnUpdate?: boolean;
}

export function useGsap(
  callback: UseGsapCallback,
  options: UseGsapOptions = {}
) {
  const { scope, dependencies = [], revertOnUpdate = true } = options;
  const contextRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    const context = gsap.context(() => {
      const cleanup = callback(contextRef.current!);
      if (cleanup && typeof cleanup === 'function') {
        return cleanup;
      }
    }, scope?.current || undefined);

    contextRef.current = context;

    return () => {
      if (revertOnUpdate) {
        context.revert();
      }
    };
  }, dependencies);

  return contextRef;
}

export { gsap, ScrollTrigger };
