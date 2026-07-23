'use client';

import React, { useState, useEffect } from 'react';

/**
 * WithdrawalProcessing — animated progress dots with estimated time for withdrawal requests.
 * 
 * Shows a "processing" state during simulated withdrawal processing delays.
 */

type Props = {
  active: boolean;
  estimatedMinutes?: number; // default: 5
};

export default function ProcessingState({ active, estimatedMinutes = 5 }: Props) {
  const [dotPhase, setDotPhase] = useState(0);

  useEffect(() => {
    if (!active) return;
    
    const interval = setInterval(() => {
      setDotPhase(prev => (prev + 1) % 3);
    }, 500);
    
    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-gray-900/80 rounded-xl border border-yellow-600/30">
      {/* Animated dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              i === dotPhase ? 'bg-yellow-400 scale-110 shadow-lg shadow-yellow-500/50' : 'bg-gray-700'
            }`}
          />
        ))}
      </div>

      {/* Text */}
      <p className="text-gray-300 font-medium">Processing withdrawal...</p>
      
      {/* Estimated time */}
      <p className="text-sm text-gray-500">
        Est. ~{estimatedMinutes} min
      </p>

      {/* Progress bar skeleton */}
      <div className="w-full max-w-xs h-2 rounded-full bg-gray-800 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-[3s] ease-in-out"
          style={{ width: `${(dotPhase + 1) * 25}%` }}
        />
      </div>
    </div>
  );
}