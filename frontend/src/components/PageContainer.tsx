import React from 'react';

export default function PageContainer({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`max-w-4xl mx-auto px-6 py-12 ${className}`}>
      {children}
    </div>
  );
}
