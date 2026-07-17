import { useState, useEffect } from 'react';

interface WinStreakBadgeProps {
  count: number;
}

export default function WinStreakBadge({ count }: WinStreakBadgeProps) {
  const [streak, setStreak] = useState(count);

  useEffect(() => {
    setStreak(count);
  }, [count]);

  const getStreakColor = (s: number): string => {
    if (s >= 4) return 'text-purple-700';
    if (s >= 3) return 'text-red-600';
    if (s >= 2) return 'text-orange-500';
    return 'text-yellow-400';
  };

  const getStreakIcon = (s: number): string => {
    if (s >= 3) return '🔥🔥🔥';
    if (s >= 2) return '🔥🔥';
    return '🔥';
  };

  const getStreakLabel = (s: number): string => {
    if (s >= 5) return 'LEGENDARY!';
    if (s >= 3) return 'ON FIRE!';
    if (s >= 2) return 'WINNING STREAK!';
    return 'GOOD START!';
  };

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/80 border border-yellow-500/30 ${getStreakColor(streak)} animate-pulse`}>
      <span className="text-xl">{getStreakIcon(streak)}</span>
      <span className="font-bold text-sm tabular-nums">x{streak}</span>
      <span className={`text-xs font-semibold ${getStreakColor(streak)}`}>{getStreakLabel(streak)}</span>
    </div>
  );
}
