import { useEffect, useState } from 'react';

interface NearMissTeaseProps {
  symbol1: string;
  symbol2: string;
  symbol3: string;
  onDismiss?: () => void;
}

export default function NearMissTease({ symbol1, symbol2, symbol3, onDismiss }: NearMissTeaseProps) {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    if (onDismiss && visible) {
      const timer = setTimeout(onDismiss, 2000);
      return () => clearTimeout(timer);
    }
  }, [onDismiss, visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
      <div className="bg-gray-900 border-4 border-yellow-500 rounded-3xl p-8 text-center animate-pulse shadow-[0_0_40px_rgba(234,179,8,0.5)]">
        <h2 className="text-4xl font-extrabold text-yellow-400 mb-4 drop-shadow-lg">
          NEAR MISS!
        </h2>
        <div className="flex gap-4 justify-center my-6">
          <span className="text-6xl">{symbol1}</span>
          <span className="text-6xl">{symbol2}</span>
          <span className="text-6xl opacity-30 grayscale blur-[1px]">{symbol3}</span>
        </div>
        <p className="text-gray-400 text-sm">So close! Try again?</p>
      </div>
    </div>
  );
}
