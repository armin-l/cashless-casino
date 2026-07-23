'use client';

import React from 'react';

/**
 * ActiveGlowRing — wraps an element with a pulsing brand-yellow glow ring.
 * 
 * Used for active button states and game panels to provide visual feedback
 * that the element is interactive/active.
 */

type Props = {
  children: React.ReactNode;
  color?: 'yellow' | 'green' | 'red' | 'blue';
  intensity?: 'normal' | 'pulse' | 'breathing';
};

const COLOR_MAP: Record<string, string> = {
  yellow: 'shadow-yellow-500/40 border-yellow-500',
  green: 'shadow-green-500/40 border-green-500',
  red: 'shadow-red-500/40 border-red-500',
  blue: 'shadow-blue-500/40 border-blue-500',
};

export default function ActiveGlowRing({ children, color = 'yellow', intensity = 'normal' }: Props) {
  const glowClass = COLOR_MAP[color];
  
  let animationClass = '';
  if (intensity === 'pulse') animationClass = 'animate-pulse';
  else if (intensity === 'breathing') animationClass = 'transition-shadow duration-1000 hover:shadow-xl';

  return (
    <div 
      className={`relative inline-flex items-center justify-center border-2 ${glowClass} ${animationClass}`}
      style={{ boxShadow: intensity === 'pulse' ? undefined : '0 0 20px rgba(251, 191, 36, 0.3)' }}
    >
      {children}
      
      {/* Outer glow layer */}
      <div className={`absolute inset-0 border rounded-lg ${intensity === 'pulse' ? 'animate-ping opacity-30' : ''}`} 
           style={{ borderColor: color === 'yellow' ? '#fbbf24' : undefined }} />
    </div>
  );
}
