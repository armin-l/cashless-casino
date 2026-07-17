import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'magenta' | 'purple' | 'gold';
}

export default function Badge({ children, variant = 'cyan' }: BadgeProps) {
  const colorClasses = {
    cyan: 'text-neon-cyan border-neon-cyan',
    magenta: 'text-neon-magenta border-neon-magenta',
    purple: 'text-neon-purple border-neon-purple',
    gold: 'text-yellow-400 border-yellow-600',
  };

  const colors = colorClasses[variant];

  return (
    <span
      data-testid="badge"
      className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider border rounded-full ${colors} bg-opacity-10`}
    >
      {children}
    </span>
  );
}
