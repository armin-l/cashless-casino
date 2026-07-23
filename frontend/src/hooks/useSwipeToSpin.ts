'use client';

import { useEffect, useRef } from 'react';

/**
 * useSwipeToSpin — horizontal swipe gesture to trigger a spin action.
 * 
 * Works on touch devices: swipe left or right with >= 60px displacement
 * triggers the provided callback. Useful for mobile-first slot machines.
 * 
 * Usage:
 *   const spin = useCallback(() => console.log('spinning!'), []);
 *   useSwipeToSpin(spin, { threshold: 50 });
 */

type Options = {
  threshold?: number; // minimum displacement in pixels (default: 60)
  direction?: 'left' | 'right'; // which swipe triggers spin (default: both)
};

const DEFAULT_OPTIONS: Required<Options> = {
  threshold: 60,
  direction: 'both',
};

export function useSwipeToSpin(
  onSpin: () => void,
  options: Options = {}
) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const startXRef = useRef<number | null>(null);

  useEffect(() => {
    let hasTriggered = false;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startXRef.current = touch.clientX;
      hasTriggered = false;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!startXRef.current) return;
      
      const touch = e.changedTouches[0];
      const dx = touch.clientX - startXRef.current;
      
      // Only trigger once per swipe gesture
      if (hasTriggered) return;

      let shouldSpin = false;
      if (opts.direction === 'left' && dx < -opts.threshold) shouldSpin = true;
      else if (opts.direction === 'right' && dx > opts.threshold) shouldSpin = true;
      else if (opts.direction === 'both') shouldSpin = Math.abs(dx) > opts.threshold;

      if (shouldSpin) {
        onSpin();
        hasTriggered = true;
      }

      startXRef.current = null;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSpin, opts.threshold, opts.direction]);

  return null;
}
