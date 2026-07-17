import { useState, useEffect } from 'react';

interface ShakeAnimationProps {
  children: React.ReactNode;
  trigger?: boolean;
  duration?: number;
}

export default function ShakeAnimation({ children, trigger = false, duration = 500 }: ShakeAnimationProps) {
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsShaking(true);
      const timer = setTimeout(() => {
        setIsShaking(false);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [trigger, duration]);

  return (
    <div
      className={`${isShaking ? 'animate-shake' : ''} inline-block`}
      style={isShaking ? { animation: 'shake 0.5s cubic-bezier(.36,.07,.19,.97)' } : {}}
    >
      {children}
    </div>
  );
}
