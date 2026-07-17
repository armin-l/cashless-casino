import { useEffect, useState } from 'react';

interface PaylineResult {
  paylines: number[][];
  winningAmount: number;
}

export default function PaylineHighlight({ paylines, winningAmount }: PaylineResult) {
  const [activePayline, setActivePayline] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (paylines.length > 0) {
      setShowAnimation(true);
      let i = 0;
      const interval = setInterval(() => {
        setActivePayline(i);
        i++;
        if (i >= paylines.length) clearInterval(interval);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [paylines]);

  if (!showAnimation) return null;

  const highlightPath = paylines[activePayline] || [];

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <svg className="w-full h-full animate-pulse animate-glow" viewBox="0 0 300 150">
        {highlightPath.map((cell, idx) => (
          <rect
            key={idx}
            x={cell[0] * 60 + 10}
            y={cell[1] * 40 + 10}
            width="50"
            height="30"
            className="fill-yellow-400/80 stroke-yellow-400 stroke-[2px]"
          />
        ))}
      </svg>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <span className="text-yellow-400 font-bold text-lg animate-pulse">
          WIN: {winningAmount} VC
        </span>
      </div>
    </div>
  );
}
