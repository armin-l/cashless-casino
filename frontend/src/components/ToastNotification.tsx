'use client';

import React, { useEffect } from 'react';

type ToastProps = {
  username: string;
  avatar?: string;
  amount: number;
  gameName?: string;
};

const TOAST_COLORS = [
  'from-yellow-500/90 to-orange-600/90',
  'from-purple-500/90 to-pink-600/90',
  'from-emerald-500/90 to-teal-600/90',
  'from-blue-500/90 to-indigo-600/90',
];

function getRandomColor() {
  return TOAST_COLORS[Math.floor(Math.random() * TOAST_COLORS.length)];
}

export default function ToastNotification({ username, amount, gameName }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Trigger CSS exit animation via class change
      const el = document.getElementById(`toast-${username}-${amount}`);
      if (el) el.classList.add('opacity-0', '-translate-x-full');
    }, 5000);
    return () => clearTimeout(timer);
  }, [username, amount]);

  const gradClass = getRandomColor();
  const toastId = `toast-${username}-${amount}`;

  return (
    <div
      id={toastId}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r ${gradClass} shadow-lg 
        text-white transform translate-x-0 transition-all duration-500 ease-in-out`}
    >
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-black/20 border border-white/30 flex items-center justify-center shrink-0">
        <span className="text-lg font-bold">{username[0]?.toUpperCase()}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-tight truncate">
          <span className="font-semibold">{username}</span>{' '}
          {gameName ? `won on ${gameName}` : 'hit a big win!'}
        </p>
        <p className="text-lg font-bold tabular-nums tracking-wide">
          +{amount.toLocaleString()} VC
        </p>
      </div>

      {/* Close button */}
      <button
        onClick={() => {
          const el = document.getElementById(toastId);
          if (el) el.classList.add('opacity-0', 'translate-x-full');
        }}
        className="shrink-0 p-1 hover:bg-white/20 rounded-full transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export function WinFeedPanel({ count = 3 }: { count?: number }) {
  const mockWins = [
    { user: 'Alex_R', amount: 4820, game: 'Slots' },
    { user: 'NeonQueen', amount: 1250, game: 'Blackjack' },
    { user: 'JackpotKing', amount: 7800, game: 'Wheel' },
    { user: 'LuckySven', amount: 340, game: 'Roulette' },
    { user: 'DiamondHandz', amount: 2100, game: 'Slots' },
  ];

  return (
    <div className="flex flex-col gap-2">
      {mockWins.slice(0, count).map((w, i) => (
        <ToastNotification key={`${w.user}-${w.amount}`} username={w.user} amount={w.amount} gameName={w.game} />
      ))}
    </div>
  );
}
