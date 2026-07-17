import { useState, useEffect } from 'react';

interface ShimmerSweepProps {
  children: React.ReactNode;
  trigger?: boolean;
  interval?: number;
}

export default function ShimmerSweep({ children, trigger = false, interval = 10000 }: ShimmerSweepProps) {
  const [isShimmering, setIsShimmering] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsShimmering(true);
      
      // Auto-dismiss after sweep completes (~2s animation)
      const timer = setTimeout(() => {
        setIsShimmering(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
    
    // Periodic shimmer if no trigger
    let intervalId: NodeJS.Timeout;
    if (trigger === false) {
      const startShimmer = () => {
        setIsShimmering(true);
        setTimeout(() => {
          setIsShimmering(false);
          intervalId = setTimeout(startShimmer, interval);
        }, 2000);
      };
      
      intervalId = setTimeout(startShimmer, interval);
    }
    
    return () => clearTimeout(intervalId);
  }, [trigger, interval]);

  return (
    <div className="relative overflow-hidden">
      {children}
      {isShimmering && (
        <div 
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            transform: 'translateX(-100%)',
            animation: 'shimmer-sweep 2s ease-in-out'
          }}
        />
      )}
    </div>
  );
}
