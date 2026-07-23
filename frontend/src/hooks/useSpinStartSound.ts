'use client';

import { useEffect, useRef } from 'react';

/**
 * useSpinStartSound — plays an anticipation build-up sound when a spin begins.
 * 
 * Uses Web Audio API to generate a rising pitch sweep that creates tension
 * before the game result is revealed. Falls back gracefully if audio unavailable.
 */

const USE_AUDIO = typeof window !== 'undefined' && 'AudioContext' in window;

export function useSpinStartSound(enabled: boolean = true) {
  const playingRef = useRef(false);
  const spinStartRef = useRef(0);

  useEffect(() => {
    if (!enabled || !USE_AUDIO) return;

    const handleSpinStart = () => {
      if (playingRef.current) return; // Prevent overlapping sounds
      
      playingRef.current = true;
      
      try {
        const ctx = new AudioContext();
        
        // Rising pitch sweep
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(200, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 1.5);
        gain1.gain.setValueAtTime(0.05, ctx.currentTime);
        gain1.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.75);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
        
        osc1.connect(gain1).connect(ctx.destination);
        osc1.start();
        osc1.stop(ctx.currentTime + 1.5);
        
        // Subtle rumble layer
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(60, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 1.2);
        gain2.gain.setValueAtTime(0.03, ctx.currentTime);
        gain2.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.6);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        
        osc2.connect(gain2).connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 1.2);
        
      } catch { /* silent fail */ }
      
      // Reset flag after sound completes
      setTimeout(() => { playingRef.current = false; }, 1600);
    };

    document.addEventListener('spinstart', handleSpinStart);
    
    return () => {
      document.removeEventListener('spinstart', handleSpinStart);
    };
  }, [enabled]);

  // Return trigger function for manual invocation
  const trigger = useRef(() => {});
  
  useEffect(() => {
    if (!enabled || !USE_AUDIO) return;
    
    trigger.current = () => {
      try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 1.5);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.75);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.5);
      } catch {} // silent fail
    };
    
    return () => { trigger.current = () => {}; };
  }, [enabled]);

  return { trigger: trigger.current };
}
