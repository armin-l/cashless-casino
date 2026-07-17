import { useState, useEffect } from 'react';

interface NeonGlowProps {
  children: React.ReactNode;
  trigger?: boolean;
  color?: string;
  duration?: number;
}

export default function NeonGlow({ children, trigger = false, color = 'yellow', duration = 2000 }: NeonGlowProps) {
  const [isGlowing, setIsGlowing] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsGlowing(true);
      const timer = setTimeout(() => {
        setIsGlowing(false);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [trigger, duration]);

  const glowColor = color === 'yellow' ? '234,179,8' : color === 'cyan' ? '6,182,212' : '147,51,234';

  return (
    <div
      className={`inline-block ${isGlowing ? `animate-neon-glow-${color}` : ''}`}
      style={isGlowing ? {
        boxShadow: `0 0 20px rgba(${glowColor}, 0.5), 0 0 40px rgba(${glowColor}, 0.3)`,
        border: `2px solid rgba(${glowColor}, 0.8)`,
        transition: 'all 0.3s ease'
      } : {
        boxShadow: 'none',
        border: '2px solid transparent'
      }}
    >
      {children}
    </div>
  );
}
