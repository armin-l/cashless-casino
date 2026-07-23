'use client';

import React, { useEffect, useRef } from 'react';

/**
 * DeferCanvas — defers non-critical canvas animations until page is idle.
 * 
 * Uses requestIdleCallback (or setTimeout fallback) to delay canvas initialization
 * until the main thread has a free moment, improving initial paint performance.
 */

type Props = {
  deferred: boolean; // whether to defer loading
  onReady?: () => void;
};

export default function DeferCanvas({ deferred, onReady }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!deferred || loadedRef.current || !containerRef.current) return;
    
    // Use requestIdleCallback when available, fall back to setTimeout
    const scheduleLoad = () => {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => loadCanvas(), { timeout: 2000 });
      } else {
        setTimeout(loadCanvas, 100);
      }
    };

    const loadCanvas = () => {
      // In production, this would initialize the canvas animation here
      loadedRef.current = true;
      onReady?.();
    };

    scheduleLoad();

    return () => {
      loadedRef.current = false;
    };
  }, [deferred, onReady]);

  if (deferred) {
    // Show a subtle placeholder while deferring
    return (
      <div ref={containerRef} className="w-full h-32 bg-gray-900/50 rounded-xl flex items-center justify-center border border-gray-800">
        <span className="text-sm text-gray-600 animate-pulse">Loading...</span>
      </div>
    );
  }

  return null; // Normal canvas renders here
}
