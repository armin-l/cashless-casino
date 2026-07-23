import React, { useState, useEffect, useRef } from 'react';
import { formatCurrency } from '../lib/format';

interface FloatNotificationProps {
  message: string;
  type: 'win' | 'loss';
  amount?: number;
}

export default function WinFloat({ message, type, amount }: FloatNotificationProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<number>(0);

  useEffect(() => {
    setVisible(true);
    timerRef.current = window.setTimeout(() => {
      setVisible(false);
    }, 1500);
    return () => clearTimeout(timerRef.current);
  }, [message, type]);

  const color = type === 'win' ? 'text-green-400' : 'text-red-400';
  const glow = type === 'win' ? 'shadow-green-500/30 shadow-lg' : 'shadow-red-500/20 shadow-lg';

  return (
    <div
      className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] pointer-events-none transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
      }`}
    >
      <div className={`flex items-center gap-3 px-6 py-3 rounded-full bg-gray-900/90 backdrop-blur-md border border-yellow-600/20 ${color} ${glow}`}>
        {type === 'win' ? (
          <>
            <span className="text-green-400 text-xl">🎉</span>
            <span className="font-mono font-bold text-lg">+{formatCurrency(amount)}</span>
            <span className="text-gray-400">{message}</span>
          </>
        ) : (
          <>
            <span className="text-red-400 text-xl">💨</span>
            <span className="font-mono font-bold text-lg">-{formatCurrency(amount)}</span>
            <span className="text-gray-400">{message}</span>
          </>
        )}
      </div>
    </div>
  );
}
