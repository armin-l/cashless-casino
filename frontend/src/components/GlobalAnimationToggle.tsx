'use client';

import React, { useState, useEffect } from 'react';

/**
 * GlobalAnimationToggle — settings toggle for global animation preferences.
 * 
 * Lets users disable non-critical animations across the entire app.
 * Persists preference to localStorage and respects prefers-reduced-motion.
 */

export default function GlobalAnimationToggle() {
  const [enabled, setEnabled] = useState(true);
  const [showingUI, setShowingUI] = useState(false);

  useEffect(() => {
    // Check reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setEnabled(false);
    }
    
    // Load from localStorage
    try {
      const stored = localStorage.getItem('casino-animations');
      if (stored !== null) setEnabled(JSON.parse(stored));
    } catch {}
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    setShowingUI(true);
    
    try {
      localStorage.setItem('casino-animations', JSON.stringify(next));
    } catch {}
    
    // Update document-level CSS custom property for runtime control
    document.documentElement.style.setProperty('--animation-enabled', String(Number(next)));
  };

  return (
    <div className="flex items-center gap-3">
      {/* Toggle switch */}
      <button
        onClick={toggle}
        className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-yellow-500' : 'bg-gray-700'}`}
        aria-label="Toggle animations"
      >
        {/* Knob */}
        <div 
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform ${enabled ? 'right-1' : 'left-1'}`}
        />
      </button>

      {/* Label */}
      <span className="text-sm text-gray-400">Animations</span>

      {/* Confirmation toast */}
      {showingUI && (
        <div className={`absolute right-0 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 shadow-lg ${enabled ? 'text-green-400' : 'text-red-400'} animate-pulse`}>
          {enabled ? '✨ Animations on' : '🚫 Animations off'}
        </div>
      )}
    </div>
  );
}
