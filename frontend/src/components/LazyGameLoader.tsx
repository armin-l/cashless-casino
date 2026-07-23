'use client';

import React, { Suspense } from 'react';

/**
 * LazyGameLoader — wraps dynamic game imports with a loading skeleton.
 *
 * Usage:
 *   <LazyGameLoader name="Slots" loader={() => import('@/pages/games/slots')}>
 *     {(Component) => <Component />}
 *   </LazyGameLoader>
 */

type Props = {
  name: string;
  children: (Component: React.ComponentType) => React.ReactNode;
};

function LoadingSkeleton({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
      {/* Spinning wheel skeleton */}
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-4 border-yellow-500/30 animate-spin" />
        <div className="absolute inset-2 rounded-full border-4 border-yellow-500/50 animate-spin" 
             style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
          <span className="text-2xl animate-pulse">{name === 'Slots' ? '🎰' : name === 'Blackjack' ? '🃏' : name === 'Roulette' ? '🎡' : '🎲'}</span>
        </div>
      </div>

      {/* Loading text */}
      <p className="text-gray-400 font-medium animate-pulse">Loading {name}...</p>

      {/* Progress bar skeleton */}
      <div className="w-48 h-2 rounded-full bg-gray-800 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 animate-pulse w-3/4" />
      </div>
    </div>
  );
}

const LOADING_TIMEOUT = 10_000; // 10s timeout for slow connections

export default function LazyGameLoader({ name, children }: Props) {
  let Component: React.ComponentType;

  try {
    Component = require(`@/pages/games/${name.toLowerCase().replace(/\s+/g, '-')}`).default;
  } catch {
    return <LoadingSkeleton name={name} />;
  }

  return children(Component);
}
