import { useState } from 'react';

interface BlackjackCardProps {
  value: string;
  suit: string;
  faceUp?: boolean;
}

export default function BlackjackCard({ value, suit, faceUp = false }: BlackjackCardProps) {
  const [flipped, setFlipped] = useState(!faceUp);

  const handleClick = () => {
    setFlipped(!flipped);
  };

  if (!flipped) {
    return (
      <div className="w-24 h-36 bg-blue-800 border-2 border-white rounded-lg shadow-xl animate-flip cursor-pointer hover:bg-blue-700 transition-colors">
        <div className="w-full h-full flex items-center justify-center text-white font-bold">
          <span className="text-2xl">🂠</span>
        </div>
      </div>
    );
  }

  const isRed = suit === '♥' || suit === '♦';
  
  return (
    <div 
      onClick={handleClick}
      className={`w-24 h-36 bg-white border-2 border-gray-200 rounded-lg shadow-xl animate-flip cursor-pointer ${isRed ? 'text-red-600' : 'text-gray-900'}`}
    >
      <div className="p-2 flex flex-col justify-between h-full">
        <div className="text-left text-sm font-bold">{value}<span className="text-xs ml-1">{suit}</span></div>
        <div className="flex items-center justify-center text-4xl">
          {suit}
        </div>
        <div className="text-right text-sm font-bold rotate-180">{value}<span className="text-xs ml-1">{suit}</span></div>
      </div>
    </div>
  );
}
