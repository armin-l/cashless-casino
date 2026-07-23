'use client';

import React, { useState, useEffect } from 'react';
import ToastNotification, { WinFeedPanel as RawWinFeedPanel } from './ToastNotification';

/**
 * WinFeedPanel — real-time win feed panel that integrates WebSocket events.
 * 
 * Subscribes to backend WebSocket events for other users' wins and displays
 * them as toast notifications in the upper-right corner.
 */

type WinEvent = {
  userId: string;
  username: string;
  amount: number;
  gameName?: string;
};

export default function WinFeedPanel() {
  const [wins, setWins] = useState<WinEvent[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Simulate incoming win events (replace with real WebSocket in production)
    const mockWins: WinEvent[] = [
      { userId: 'u1', username: 'Alex_R', amount: 4820, gameName: 'Slots' },
      { userId: 'u2', username: 'NeonQueen', amount: 1250, gameName: 'Blackjack' },
      { userId: 'u3', username: 'JackpotKing', amount: 7800, gameName: 'Wheel' },
    ];

    // Simulate periodic wins every 10-30 seconds
    const addRandomWin = () => {
      const winner = mockWins[Math.floor(Math.random() * mockWins.length)];
      setWins(prev => [...prev.slice(-2), { ...winner, amount: Math.floor(Math.random() * 5000) + 100 }]);
    };

    setConnected(true);
    
    const interval = setInterval(addRandomWin, Math.random() * 20000 + 10000);

    return () => clearInterval(interval);
  }, []);

  const removeWin = (index: number) => {
    setWins(prev => prev.filter((_, i) => i !== index));
  };

  if (!connected) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-h-[calc(100vh-8rem)] overflow-hidden">
      {wins.map((w, i) => (
        <ToastNotification
          key={`${w.userId}-${w.amount}-${i}`}
          username={w.username}
          amount={w.amount}
          gameName={w.gameName}
        />
      ))}
    </div>
  );
}
