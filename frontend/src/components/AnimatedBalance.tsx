import { useState, useEffect } from 'react';

interface AnimatedBalanceProps {
  initialBalance?: number;
  duration?: number;
}

export default function AnimatedBalance({ initialBalance = 1000, duration = 800 }: AnimatedBalanceProps) {
  const [displayedBalance, setDisplayedBalance] = useState(initialBalance);
  const [targetBalance, setTargetBalance] = useState(initialBalance);

  useEffect(() => {
    // When targetBalance changes, animate to it over `duration` ms
    let startTime: number | null = null;
    let rafId: number | undefined;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const current = Math.round(displayedBalance + (targetBalance - displayedBalance) * easedProgress);
      setDisplayedBalance(current);

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    // Reset when target changes
    setDisplayedBalance(targetBalance);
    startTime = null;

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [targetBalance]);

  const formatBalance = (value: number): string =>
    value.toLocaleString(undefined, { minimumFractionDigits: 2 });

  return (
    <div className="flex items-center gap-2 bg-gray-900 bg-opacity-80 backdrop-blur-sm border border-yellow-600 border-opacity-30 rounded-xl px-4 py-2">
      <span className="text-yellow-400 text-lg font-bold tracking-wider select-none">VC</span>
      <span
        data-testid="animated-balance"
        className="text-white text-2xl font-mono tabular-nums min-w-[8ch] text-right"
      >
        {formatBalance(displayedBalance)}
      </span>
    </div>
  );
}
