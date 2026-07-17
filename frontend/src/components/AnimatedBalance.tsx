import React, { useState, useEffect, useRef } from 'react';
import { formatCurrency } from '../lib/format';

interface AnimatedBalanceProps {
  targetBalance: number;
  duration?: number;
  className?: string;
}

export default function AnimatedBalance({ targetBalance, duration = 800, className }: AnimatedBalanceProps) {
  const [displayed, setDisplayed] = useState(targetBalance);
  const prevTargetRef = useRef(targetBalance);

  useEffect(() => {
    if (targetBalance === prevTargetRef.current) return;

    const start = prevTargetRef.current;
    const diff = targetBalance - start;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOutExpo for smooth deceleration
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayed(start + diff * eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayed(targetBalance);
        prevTargetRef.current = targetBalance;
      }
    }

    const frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [targetBalance, duration]);

  return (
    <span className={className ?? 'font-mono tabular-nums'}>
      {formatCurrency(displayed)}
    </span>
  );
}
