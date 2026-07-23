'use client';

import React, { useState, useEffect } from 'react';

/**
 * ProgressiveJackpotMeter — fills up as the jackpot approaches.
 * 
 * Displays a glowing meter bar that animates toward a target value,
 * with pulsing glow effects when near the threshold.
 */

type Props = {
  current: number;
  target: number;
  label?: string;
  icon?: string;
};

export default function ProgressiveJackpotMeter({ current, target, label = 'JACKPOT', icon = '💰' }: Props) {
  const pct = Math.min(100, (current / target) * 100);
  const isNear = pct > 85;
  const isAlmost = pct > 95;

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Label */}
      <div className="flex items-center justify-center gap-2 mb-2">
        {isNear && (
          <span className="animate-pulse text-yellow-400 text-sm font-bold tracking-widest">
            ⚡ {label}
          </span>
        )}
        {!isNear && (
          <span className="text-gray-500 text-xs uppercase tracking-widest flex items-center gap-1">
            {icon} {label}
          </span>
        )}
      </div>

      {/* Meter bar */}
      <div className={`relative h-8 rounded-full overflow-hidden border ${isNear ? 'border-yellow-500/50 shadow-lg shadow-yellow-500/20' : 'border-gray-700'} transition-all duration-300`}>
        {/* Background gradient track */}
        <div className="absolute inset-1 rounded-full bg-gray-900" />

        {/* Fill bar with animated width */}
        <div 
          className={`h-full rounded-full flex items-center justify-end pr-2 transition-all duration-[2s] ease-out ${isAlmost ? 'bg-gradient-to-r from-yellow-400 via-yellow-300 to-orange-500 animate-pulse' : pct > 70 ? 'bg-gradient-to-r from-yellow-600 to-yellow-500' : 'bg-gradient-to-r from-gray-700 to-gray-600'}`}
          style={{ width: `${pct}%` }}
        >
          {/* Sparkle effect near target */}
          {isNear && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
          )}
        </div>

        {/* Amount text overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xs font-bold tabular-nums ${isNear ? 'text-yellow-300' : 'text-gray-400'}`}>
            {current.toLocaleString()} / {target.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Flash overlay when very close */}
      {isAlmost && (
        <div className="absolute inset-0 rounded-full bg-yellow-400/10 animate-pulse pointer-events-none" />
      )}
    </div>
  );
}
