'use client';

import React, { useState, useEffect } from 'react';

/**
 * FloatingCredits — "+Credits" / "−Credits" floating notification.
 * 
 * Shows a floating text label that animates up and fades out near the source of action.
 * Used for balance changes (wins/losses) positioned close to where they occurred.
 */

type Props = {
  amount: number; // positive for wins, negative for losses
  x?: number; // left position percentage (default: center)
  y?: number; // top position percentage from source (default: -20)
};

export default function FloatingCredits({ amount, x = 50, y = -30 }: Props) {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    if (!visible) return;
    
    // Auto-hide after animation completes
    const timer = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;
  
  const isWin = amount > 0;
  const color = isWin ? 'text-green-400' : 'text-red-400';
  const sign = isWin ? '+' : '−';
  
  return (
    <div
      className={`absolute left-1/2 -translate-x-1/2 font-bold text-lg ${color} animate-bounce`}
      style={{ top: `calc(var(--source-y, 0) + ${y}px)` }}
    >
      {sign}{Math.abs(amount).toLocaleString()} VC
    </div>
  );
}
