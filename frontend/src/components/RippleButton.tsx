'use client';

import React, { useRef, useCallback } from 'react';

/**
 * RippleButton — button with watercolor ripple burst effect on press.
 * 
 * Shows an expanding circle that fades out when clicked, providing satisfying
 * visual feedback for every interaction. Works with any content as children.
 */

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: string; // ripple color (default: yellow)
};

export default function RippleButton({ 
  children, 
  className = '', 
  onClick,
  color = '#fbbf24',
  ...props 
}: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const ripplesRef = useRef<{ x: number; y: number; id: number }[]>([]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ripplesRef.current.push({ x, y, id: Date.now() });
    
    onClick?.(e);
  }, [onClick]);

  return (
    <button
      ref={buttonRef}
      className={`relative overflow-hidden active:scale-95 transition-transform ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}

      {/* Ripple effects */}
      {ripplesRef.current.map(({ x, y, id }) => (
        <span
          key={id}
          className="absolute pointer-events-none"
          style={{
            left: `${x}px`,
            top: `${y}px`,
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: color,
            transform: 'translate(-50%, -50%) scale(0)',
            animation: 'ripple-expand 0.6s ease-out forwards',
          }}
        />
      ))}

      <style>{`
        @keyframes ripple-expand {
          to {
            width: 300px;
            height: 300px;
            opacity: 0;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </button>
  );
}
