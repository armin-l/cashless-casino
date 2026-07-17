import { useState, useEffect } from 'react';

interface WinCelebrationProps {
  amount: number;
  multiplier?: number;
  onClose?: () => void;
}

export default function WinCelebration({ amount, multiplier = 1.0, onClose }: WinCelebrationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (onClose) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [onClose]);

  const formatAmount = (value: number): string => 
    value.toLocaleString(undefined, { minimumFractionDigits: 2 });

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
      <div className="bg-gray-900 border-4 border-yellow-500 rounded-3xl p-12 text-center animate-pulse shadow-[0_0_40px_rgba(234,179,8,0.5)]">
        <h1 className="text-6xl font-extrabold text-yellow-400 mb-4 drop-shadow-lg">
          BIG WIN!
        </h1>
        <div className="text-white text-5xl font-mono tabular-nums my-8">
          +{formatAmount(amount)} <span className="text-gray-400 text-xl">VC</span>
        </div>
        {multiplier > 1 && (
          <div className="text-yellow-300 text-2xl font-bold">
            x{multiplier.toFixed(1)} MULTIPLIER
          </div>
        )}
      </div>
    </div>
  );
}
