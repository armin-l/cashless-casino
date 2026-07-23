'use client';

import React from 'react';

/**
 * VisualRegressionIndicator — placeholder for visual regression testing.
 * 
 * Shows a subtle indicator when visual regression snapshots are being captured,
 * useful during development to verify component states match expected baselines.
 */

type Props = {
  active?: boolean;
  label?: string;
};

export default function VisualRegressionIndicator({ active = false, label = 'REGRESSION TEST' }: Props) {
  if (!active) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[100] bg-yellow-500/90 text-black px-3 py-2 rounded-lg shadow-xl font-mono text-xs pointer-events-none">
      <span className="font-bold">{label}</span>
      <span className="ml-2 animate-pulse">●</span>
    </div>
  );
}

// Hook for capturing component states during development
export function useVisualRegression(name: string) {
  const [showIndicator, setShowIndicator] = useState(true);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    
    // Show indicator in dev mode for visual regression tracking
    setShowIndicator(true);
  }, []);

  return showIndicator ? <VisualRegressionIndicator label={name} /> : null;
}
