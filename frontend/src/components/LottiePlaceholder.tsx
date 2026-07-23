'use client';

import React, { useState, useEffect } from 'react';

/**
 * LottiePlaceholder — placeholder for complex Lottie/Rive animations.
 * 
 * Shows a subtle loading animation while the actual Lottie library loads,
 * then swaps to the loaded animation. Falls back gracefully if no animation
 * is available.
 */

type AnimationType = 'confetti' | 'particles' | 'sparkle';

interface Props {
  type: AnimationType;
  active?: boolean;
  size?: number; // px (default: 64)
}

const ANIMATION_CONFIGS: Record<AnimationType, { color: string; emoji: string }> = {
  confetti: { color: '#fbbf24', emoji: '🎊' },
  particles: { color: '#a78bfa', emoji: '✨' },
  sparkle: { color: '#34d399', emoji: '💫' },
};

export default function LottiePlaceholder({ type, active = true, size = 64 }: Props) {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    if (!active) return;
    
    // Simulate loading delay (in production, this would be the actual animation load time)
    const timer = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(timer);
  }, [active]);

  const config = ANIMATION_CONFIGS[type];

  if (!active && !loaded) {
    // Loading skeleton
    return (
      <div 
        className="flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <div className={`w-4 h-4 border-2 rounded-full animate-spin`} 
             style={{ borderTopColor: config.color }} />
      </div>
    );
  }

  if (!loaded) {
    return null;
  }

  // In production, this would render the actual Lottie animation element
  // For now, show a subtle visual indicator that the animation is "active"
  return (
    <div 
      className="relative flex items-center justify-center animate-pulse"
      style={{ width: size, height: size }}
    >
      <span className="text-3xl">{config.emoji}</span>
    </div>
  );
}

// Export hooks for integrating with existing animation systems
export function useLottieAnimation(
  animationUrl?: string, 
  options?: { loop?: boolean; autoplay?: boolean }
) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [animationRef, setAnimationRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!animationUrl || !animationRef) return;

    // In production, this would load the Lottie player and render the animation
    setIsLoaded(true);
    
    return () => {
      setIsLoaded(false);
    };
  }, [animationUrl, animationRef]);

  return { isLoaded, setAnimationRef };
}
