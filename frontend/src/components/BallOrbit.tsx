'use client';

import React, { useEffect, useRef } from 'react';

/**
 * BallOrbit — animates a ball orbiting around the roulette wheel.
 * 
 * Uses CSS transforms with requestAnimationFrame for smooth orbital motion
 * that gradually decelerates before landing on the winning number.
 */

type Props = {
  spinning: boolean;
  speed?: 'slow' | 'normal' | 'fast'; // default: normal
  orbitRadius?: number; // px from center (default: 120)
  ballSize?: number; // diameter in px (default: 16)
  color?: string; // ball color (default: #f87171 / red-400)
};

const SPEED_MAP = {
  slow: 0.5,
  normal: 1,
  fast: 2,
} as const;

export default function BallOrbit({ spinning, speed = 'normal', orbitRadius = 120, ballSize = 16, color = '#f87171' }: Props) {
  const angleRef = useRef(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!spinning) return;
    
    let animFrame: number;
    let startTime: number | null = null;
    const duration = 4000; // ms for full spin sequence
    
    const animate = (time: number) => {
      if (!startTime) startTime = time;
      
      const elapsed = time - startTime;
      const progress = Math.min(1, elapsed / duration);
      
      // Deceleration curve — slows down gradually
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      angleRef.current += (easedProgress * SPEED_MAP[speed] * 0.05) % (Math.PI * 2);
      
      animFrame = requestAnimationFrame(animate);
    };

    animFrame = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animFrame);
  }, [spinning, speed]);

  if (!spinning) return null;

  const cx = orbitRadius + ballSize / 2; // center offset from wheel center
  const x = Math.cos(angleRef.current) * orbitRadius + cx - ballSize / 2;
  const y = Math.sin(angleRef.current) * orbitRadius + cx - ballSize / 2;

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Ball shadow */}
      <div 
        className="absolute w-4 h-4 bg-black/30 rounded-full blur-sm"
        style={{ left: `${x + 2}px`, top: `${y + 2}px` }}
      />
      {/* Ball */}
      <div 
        className="absolute w-4 h-4 rounded-full shadow-lg"
        style={{ 
          left: `${x}px`, 
          top: `${y}px`,
          background: `radial-gradient(circle at 30% 30%, #ffffff, ${color})`
        }}
      />
    </div>
  );
}
