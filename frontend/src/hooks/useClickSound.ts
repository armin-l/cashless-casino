'use client';

import { useEffect, useRef } from 'react';

/**
 * useClickSound — plays a short synthesized click on button presses.
 * 
 * Uses Web Audio API to generate a brief mechanical "click" sound.
 Respects prefers-reduced-motion and accessibility settings.
 */

const CLICK_VOLUME = 0.15;
const CLICK_FREQ = 800;
const CLICK_DURATION = 0.06;

function playClick() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(CLICK_FREQ, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + CLICK_DURATION);
    
    gain.gain.setValueAtTime(CLICK_VOLUME, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + CLICK_DURATION);
    
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + CLICK_DURATION);
  } catch {
    // Audio not available — silent fail
  }
}

export function useClickSound(enabled: boolean = true) {
  const clickRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    
    const handleClick = () => playClick();
    
    // Attach to document for global button click feedback
    document.addEventListener('click', handleClick, { once: false });
    
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [enabled]);

  return clickRef;
}

// Convenience wrapper that plays a single click and returns cleanup function
export function playClickSound() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(CLICK_FREQ, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + CLICK_DURATION);
    
    gain.gain.setValueAtTime(CLICK_VOLUME, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + CLICK_DURATION);
    
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + CLICK_DURATION);
  } catch { /* silent fail */ }
}
