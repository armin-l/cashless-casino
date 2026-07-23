'use client';

import React, { useEffect } from 'react';

/**
 * SoundFeedback — global sound feedback provider for the entire app.
 * 
 * Centralizes all audio hooks (click, win, spin) and provides a context
 * for controlling volume and muting across the application.
 */

type Props = {
  children: React.ReactNode;
  enabled?: boolean;
  masterVolume?: number; // 0-1 (default: 0.3)
};

export default function SoundFeedbackProvider({ 
  children, 
  enabled = true, 
  masterVolume = 0.3 
}: Props) {
  const [isMuted, setIsMuted] = React.useState(false);

  useEffect(() => {
    if (enabled) return;
    // When disabled globally, mute everything
    document.documentElement.style.setProperty('--sound-enabled', '0');
  }, [enabled]);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  return (
    <>
      {/* Mute/unmute button in corner */}
      <button
        onClick={toggleMute}
        className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-gray-900/80 border border-yellow-600/30 
          flex items-center justify-center text-lg hover:bg-gray-800/80 transition-colors"
        aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
      >
        {isMuted || !enabled ? '🔇' : '🔊'}
      </button>

      {/* Sound controls overlay */}
      <div className="fixed bottom-20 right-4 z-50 hidden">
        {/* Volume slider placeholder */}
      </div>

      {children}
    </>
  );
}
