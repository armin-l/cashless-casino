import { useState, useEffect } from 'react';

interface ReelStripProps {
  symbols?: string[];
  spinning?: boolean;
}

const DEFAULT_SYMBOLS = ['🍒', '🍋', '💎', '7️⃣', '⭐', '🍀'];

export default function ReelStrip({ symbols = DEFAULT_SYMBOLS, spinning = false }: ReelStripProps) {
  const [currentSymbol, setCurrentSymbol] = useState(symbols[0]);
  
  useEffect(() => {
    if (!spinning) return;

    let interval: NodeJS.Timeout;
    let counter = 0;
    
    interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * symbols.length);
      setCurrentSymbol(symbols[randomIndex]);
      counter++;
      
      if (counter > 20) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [spinning, symbols]);

  return (
    <div className="relative">
      <div className={`border-4 ${spinning ? 'border-yellow-500 animate-thud' : 'border-gray-700'} rounded-lg overflow-hidden bg-gray-900 w-20 h-20 flex items-center justify-center`}>
        <span className="text-4xl">{currentSymbol}</span>
      </div>
    </div>
  );
}
