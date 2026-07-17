import React, { useState, useEffect, useRef } from 'react';
import { formatCurrency } from '../lib/format';

interface WinCelebrationProps {
  amount: number;
  isJackpot?: boolean;
  visible: boolean;
  onClose: () => void;
}

export default function WinCelebration({ amount, isJackpot = false, visible, onClose }: WinCelebrationProps) {
  const [showing, setShowing] = useState(visible);

  React.useEffect(() => {
    if (visible && !showing) {
      setShowing(true);
      const timer = setTimeout(onClose, isJackpot ? 5000 : 3500);
      return () => clearTimeout(timer);
    } else if (!visible && showing) {
      setShowing(false);
    }
  }, [visible, showing, onClose, isJackpot]);

  const overlay = isJackpot 
    ? 'bg-yellow-500/10' 
    : 'bg-green-500/5';
  const glowColor = isJackpot ? 'shadow-[0_0_60px_rgba(234,179,8,0.4)]' : 'shadow-lg shadow-green-500/20';

  return (
    <div className={`fixed inset-0 z-[99] flex items-center justify-center pointer-events-none transition-opacity duration-300 ${showing ? 'opacity-100' : 'opacity-0'}`}>
      {/* Dimmed overlay */}
      <div className={`absolute inset-0 ${overlay}`} onClick={onClose} />

      {/* Center content */}
      <div className={`relative z-10 flex flex-col items-center text-center p-8 rounded-2xl bg-gray-950/80 backdrop-blur-md border border-yellow-600/30 ${glowColor}`}>
        {isJackpot ? (
          <>
            <span className="text-7xl mb-4 animate-bounce">🏆</span>
            <p className="text-yellow-400 text-xl font-bold uppercase tracking-widest mb-2">JACKPOT!</p>
          </>
        ) : (
          <>
            <span className="text-5xl mb-3 animate-pulse">✨</span>
            <p className="text-green-400 text-lg font-bold uppercase tracking-wider mb-1">WIN!</p>
          </>
        )}

        {/* Rolling counter */}
        <div className="relative overflow-hidden h-[52px] flex items-center justify-center">
          <span className={`font-mono tabular-nums ${isJackpot ? 'text-6xl text-yellow-400' : 'text-5xl text-green-400'}`}>
            {amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            <span className="text-lg align-super ml-1 opacity-70">VC</span>
          </span>
        </div>

        {!isJackpot && (
          <button 
            onClick={onClose} 
            className="mt-4 px-6 py-2 rounded-full bg-yellow-500/90 text-gray-900 font-bold hover:bg-yellow-400 transition-colors"
          >
            Continue Playing
          </button>
        )}

        {/* Sparkle particles */}
        {isJackpot && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                className="absolute text-yellow-400 text-xs animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: '1.5s',
                }}
              >
                ✦
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
