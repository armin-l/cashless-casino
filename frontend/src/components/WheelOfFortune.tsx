import { useState, useEffect } from 'react';

interface PrizeSegment {
  label: string;
  value: number;
  color: string;
}

export default function WheelOfFortune() {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<PrizeSegment | null>(null);

  const prizes: PrizeSegment[] = [
    { label: '$100', value: 100, color: 'bg-red-500' },
    { label: '$200', value: 200, color: 'bg-blue-500' },
    { label: '$500', value: 500, color: 'bg-green-500' },
    { label: '$1000', value: 1000, color: 'bg-yellow-500' },
    { label: '$50', value: 50, color: 'bg-purple-500' },
    { label: '$300', value: 300, color: 'bg-pink-500' },
    { label: '$750', value: 750, color: 'bg-indigo-500' },
    { label: '$5000', value: 5000, color: 'bg-orange-500' },
  ];

  const spin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setResult(null);
    
    const newRotation = rotation + Math.random() * 360 * 10 + 720;
    setRotation(newRotation);
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * prizes.length);
      setResult(prizes[randomIndex]);
      setIsSpinning(false);
    }, 4000);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className={`relative w-64 h-64 ${isSpinning ? 'animate-spin' : ''}`} style={{ transform: `rotate(${rotation}deg)` }}>
        {prizes.map((prize, i) => (
          <div
            key={i}
            className={`absolute top-0 left-1/2 w-8 h-32 origin-bottom -ml-4 ${prize.color}`}
            style={{ transform: `rotate(${i * 45}deg)` }}
          >
            <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs rotate-90">
              {prize.label}
            </div>
          </div>
        ))}
        
        {/* Pointer */}
        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      <button 
        onClick={spin}
        disabled={isSpinning}
        className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-xl transition-all active:scale-95 disabled:opacity-50"
      >
        {isSpinning ? 'Spinning...' : 'SPIN'}
      </button>

      {result && (
        <div className="text-center text-white font-bold text-2xl animate-bounce">
          <span className={`inline-block px-4 py-2 rounded-lg ${result.color}`}>
            WON: {result.label}!
          </span>
        </div>
      )}
    </div>
  );
}
