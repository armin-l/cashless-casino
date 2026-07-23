'use client';

import React, { useState, useEffect } from 'react';

/**
 * RankArrow — animated green up-arrow / red down-arrow for leaderboard rank changes.
 * 
 * Shows a directional arrow that pulses briefly when the rank changes,
 * then fades to a static indicator.
 */

type Props = {
  currentRank: number;
  previousRank?: number;
  animateDuration?: number; // ms for the pulse animation (default: 2000)
};

export default function RankArrow({ 
  currentRank, 
  previousRank, 
  animateDuration = 2000 
}: Props) {
  const [showingAnimation, setShowingAnimation] = useState(false);
  
  useEffect(() => {
    if (previousRank === undefined || previousRank === null) return;
    
    if (currentRank < previousRank) {
      // Climbing up — green arrow
      setShowingAnimation(true);
      const timer = setTimeout(() => setShowingAnimation(false), animateDuration);
      return () => clearTimeout(timer);
    } else if (currentRank > previousRank) {
      // Falling down — red arrow
      setShowingAnimation(true);
      const timer = setTimeout(() => setShowingAnimation(false), animateDuration);
      return () => clearTimeout(timer);
    }
  }, [currentRank, previousRank]);

  const isClimbing = previousRank !== undefined && currentRank < previousRank;
  
  if (!showingAnimation && !previousRank) {
    // No rank change to show — empty state
    return null;
  }

  return (
    <span className={`inline-flex items-center justify-center w-5 h-5 ${
      isClimbing ? 'text-green-400' : 'text-red-400'
    } ${showingAnimation ? 'animate-bounce' : ''} transition-colors duration-300`}>
      {isClimbing ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 14l5-5 5 5H7z" />
        </svg>
      ) : previousRank !== undefined ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 10l5 5 5-5H7z" />
        </svg>
      ) : null}
    </span>
  );
}

/**
 * AnimatedRankDisplay — wrapper that shows rank with change animation.
 */
export function AnimatedRank({ rank, prevRank }: { rank: number; prevRank?: number }) {
  return (
    <div className="flex items-center gap-1">
      <span className="tabular-nums font-bold">{rank}</span>
      <RankArrow currentRank={rank} previousRank={prevRank} />
    </div>
  );
}
