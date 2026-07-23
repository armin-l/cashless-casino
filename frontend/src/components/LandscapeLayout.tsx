'use client';

import React, { useState, useEffect } from 'react';

/**
 * LandscapeLayout — responsive landscape-mode layout for roulette and blackjack.
 * 
 * On wide screens (landscape), splits the game into two panels:
 * - Left: Game visual area (wheel/card deck)
 * - Right: Betting controls and info
 * Falls back to stacked single-column on mobile/Portrait.
 */

type Props = {
  children: React.ReactNode;
  leftPanel?: React.ReactNode;
  rightPanel?: React.ReactNode;
  icon?: string;
  title?: string;
};

export default function LandscapeLayout({ children, leftPanel, rightPanel, icon, title }: Props) {
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const checkLandscape = () => {
      // Desktop: min-width breakpoint for landscape layout
      // Mobile: always portrait/stacked
      setIsLandscape(window.matchMedia('(min-width: 768px) and (orientation: landscape)').matches);
    };

    checkLandscape();
    window.addEventListener('orientationchange', () => setTimeout(checkLandscape, 100));
    window.addEventListener('resize', checkLandscape);

    return () => {
      window.removeEventListener('orientationchange', checkLandscape);
      window.removeEventListener('resize', checkLandscape);
    };
  }, []);

  if (isLandscape && leftPanel && rightPanel) {
    return (
      <div className="flex flex-row gap-6 p-4 max-w-7xl mx-auto">
        {/* Left: Game visual */}
        <div className="flex-1 min-w-0">
          <div className="bg-gray-900/80 rounded-2xl border border-yellow-600/30 p-6 h-full">
            {leftPanel}
          </div>
        </div>

        {/* Right: Controls */}
        <div className="w-80 shrink-0 space-y-4">
          {/* Header */}
          {(title || icon) && (
            <div className="flex items-center gap-3 bg-gray-900/80 rounded-xl p-4 border border-yellow-600/30">
              {icon && <span className="text-3xl">{icon}</span>}
              {title && <h2 className="text-lg font-bold text-white">{title}</h2>}
            </div>
          )}

          {/* Right panel content */}
          <div className="bg-gray-900/80 rounded-2xl border border-yellow-600/30 p-4">
            {rightPanel}
          </div>
        </div>
      </div>
    );
  }

  // Portrait / mobile: stacked single-column layout
  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto p-4">
      {/* Header */}
      {(title || icon) && (
        <div className="flex items-center justify-center gap-3 bg-gray-900/80 rounded-xl p-4 border border-yellow-600/30">
          {icon && <span className="text-3xl">{icon}</span>}
          {title && <h2 className="text-lg font-bold text-white">{title}</h2>}
        </div>
      )}

      {/* Full-width game area */}
      <div className="bg-gray-900/80 rounded-2xl border border-yellow-600/30 p-4">
        {children || leftPanel}
      </div>

      {/* Controls below */}
      {rightPanel && (
        <div className="space-y-4">
          {rightPanel}
        </div>
      )}
    </div>
  );
}
