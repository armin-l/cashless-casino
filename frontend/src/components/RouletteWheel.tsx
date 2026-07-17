import { useState, useEffect } from 'react';

interface RouletteResult {
  winningNumber: number;
  color: string;
}

export default function RouletteWheel() {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<RouletteResult | null>(null);

  const numbers = Array.from({ length: 37 }, (_, i) => i); // 0-36

  const spin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setResult(null);
    
    const newRotation = rotation + Math.random() * 360 * 5 + 180;
    setRotation(newRotation);
    
    setTimeout(() => {
      const winningNumber = Math.floor(Math.random() * 37);
      const color = numbers[winningNumber] === 0 ? 'black' : 
        [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(winningNumber) ? 'red' : 'black';
      
      setResult({ winningNumber, color });
      setIsSpinning(false);
    }, 4000);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className={`relative w-64 h-64 ${isSpinning ? 'animate-spin' : ''}`} style={{ transform: `rotate(${rotation}deg)` }}>
        {/* Wheel segments */}
        {numbers.map((num, i) => (
          <div
            key={num}
            className="absolute top-0 left-1/2 w-4 h-32 origin-bottom -ml-2"
            style={{ transform: `rotate(${i * 9.73}deg)` }}
          >
            <div className={`w-full h-full ${num === 0 ? 'bg-gray-800' : (i % 2 === 0 ? 'bg-red-600' : 'bg-black')} rounded-t-sm`} />
          </div>
        ))}
        
        {/* Ball */}
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
        <div className="text-center text-white font-bold text-2xl">
          <span className={`inline-block px-4 py-2 rounded-lg ${result.color === 'red' ? 'bg-red-600' : 'bg-gray-800'}`}>
            {result.winningNumber}
          </span>
        </div>
      )}
    </div>
  );
}
