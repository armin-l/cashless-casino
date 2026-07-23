'use client';

import React, { useState } from 'react';

/**
 * ReelThud — visual flash on individual reel stop.
 * 
 * Shows a border flash effect when an individual slot reel stops spinning,
 * providing tactile feedback for each reel's completion.
 */

type Props = {
  active: boolean; // whether this reel is currently stopping
  color?: string; // flash color (default: yellow)
};

const THUD_COLORS: Record<string, string> = {
  default: 'border-yellow-500',
  red: 'border-red-500',
  green: 'border-green-500',
  blue: 'border-blue-500',
};

export function ReelThud({ active }: Props) {
  const [flash, setFlash] = useState(false);

  React.useEffect(() => {
    if (active) {
      setFlash(true);
      // Quick pulse: flash for 300ms then fade
      const timer = setTimeout(() => setFlash(false), 300);
      return () => clearTimeout(timer);
    }
  }, [active]);

  return (
    <div className={`transition-all duration-150 ${flash ? 'border-yellow-400 shadow-lg shadow-yellow-500/30' : ''}`}>
      {/* Reel content area */}
    </div>
  );
}

/**
 * SpinThud — combined thud animation for all reels.
 * 
 * Triggered when a slot machine spin completes, shows a brief
 * container-wide flash to signal the final result.
 */
export function SpinThud({ active }: { active: boolean }) {
  const [flashing, setFlashing] = useState(false);

  React.useEffect(() => {
    if (active) {
      setFlashing(true);
      const timer = setTimeout(() => setFlashing(false), 500);
      return () => clearTimeout(timer);
    }
  }, [active]);

  return (
    <div className={`transition-all duration-300 ${flashing ? 'ring-4 ring-yellow-400/50' : ''}`}>
      {/* Slot machine container */}
    </div>
  );
}
