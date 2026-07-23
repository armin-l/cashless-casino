'use client';

import React, { useState, useEffect } from 'react';

/**
 * CompletionToast — notification toast after a simulated delay completes.
 * 
 * Shows a success/error toast that auto-dismisses after a set duration.
 */

type Props = {
  visible: boolean;
  message: string;
  type?: 'success' | 'error' | 'info';
  onDismiss?: () => void;
};

export default function CompletionToast({ visible, message, type = 'success', onDismiss }: Props) {
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    if (visible) {
      setShowing(true);
      // Auto-dismiss after 5s
      const timer = setTimeout(() => {
        setShowing(false);
        onDismiss?.();
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setShowing(false);
    }
  }, [visible, onDismiss]);

  if (!showing && !visible) return null;

  const colors = {
    success: 'bg-green-600 border-green-500 text-white',
    error: 'bg-red-600 border-red-500 text-white',
    info: 'bg-blue-600 border-blue-500 text-white',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${colors[type]} ${showing ? 'animate-slide-in' : ''}`}>
      <span className="text-xl font-bold">{icons[type]}</span>
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
