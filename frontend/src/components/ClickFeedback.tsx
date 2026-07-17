import React from 'react';

interface ClickButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function ClickFeedback({ children, onClick, className = '' }: ClickButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-xl 
        transition-all active:scale-95 active:ring-4 active:ring-yellow-300 
        ${className}
      `}
    >
      {children}
    </button>
  );
}
