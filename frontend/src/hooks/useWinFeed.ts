import { useState, useEffect } from 'react';

interface WinEvent {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  game?: string;
  timestamp: Date;
}

export function useWinFeed() {
  const [wins, setWins] = useState<WinEvent[]>([]);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    // WebSocket connection placeholder - real implementation will connect to backend
    const ws = new WebSocket('ws://localhost:8000/ws/wins');
    
    ws.onmessage = (event) => {
      try {
        const winEvent: WinEvent = JSON.parse(event.data);
        setWins((prevWins) => [...prevWins, winEvent]);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
          setShowOverlay(false);
        }, 5000);
      } catch (error) {
        console.error('Failed to parse win event:', error);
      }
    };

    return () => ws.close();
  }, []);

  const addWin = (winEvent: WinEvent) => {
    setWins((prevWins) => [...prevWins, winEvent]);
    setShowOverlay(true);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setShowOverlay(false);
    }, 5000);
  };

  const removeWin = (winId: string) => {
    setWins((prevWins) => prevWins.filter((w) => w.id !== winId));
  };

  return { wins, showOverlay, addWin, removeWin };
}
