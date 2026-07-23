'use client';

import { useEffect, useRef } from 'react';

/**
 * useWinSound — conditional sound dispatcher for win events.
 *
 * Fires different synthesized audio tones based on win magnitude:
 *   - small wins  (amount < 100)    → short chime
 *   - medium wins (100-500)         → ascending arpeggio
 *   - big wins  (> 500, isJackpot)  → dramatic fanfare burst
 *
 * Falls back to Web Audio API oscillator beeps if no audio files loaded yet.
 */

type WinSoundOptions = {
  winAmount: number;
  isJackpot?: boolean;
  volume?: number;
};

const DEFAULT_VOLUME = 0.3;

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', vol = 0.3) {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // AudioContext not available — silent fail
  }
}

export function useWinSound(options: WinSoundOptions) {
  const triggerRef = useRef(0);

  useEffect(() => {
    triggerRef.current++;
    const id = triggerRef.current;

    // Small delay to avoid racing with rapid successive triggers
    setTimeout(() => {
      if (id !== triggerRef.current) return;

      const { winAmount, isJackpot = false, volume = DEFAULT_VOLUME } = options;

      if (isJackpot || winAmount > 500) {
        // Fanfare: ascending arpeggio burst
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          setTimeout(() => playTone(freq, 0.4, 'sine', volume), i * 100);
        });
      } else if (winAmount > 100) {
        // Ascending chime for medium wins
        [523.25, 659.25].forEach((freq, i) => {
          setTimeout(() => playTone(freq, 0.3, 'sine', volume), i * 80);
        });
      } else if (winAmount > 0) {
        // Short blip for small wins
        playTone(784, 0.15, 'sine', volume);
      }
    }, 50);
  }, [options.winAmount, options.isJackpot]);

  return triggerRef;
}
