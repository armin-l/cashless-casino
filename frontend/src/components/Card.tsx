import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div
      data-testid="card"
      className={`bg-gray-800 bg-opacity-70 backdrop-blur-sm border border-yellow-600 border-opacity-20 rounded-2xl p-6 ${className}`}
    >
      {children}
    </div>
  );
}
