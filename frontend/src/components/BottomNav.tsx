'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * BottomNavigation — mobile-first bottom nav bar.
 * 
 * Shows a compact tab bar at the bottom on mobile screens for quick game access.
 * Hidden on desktop (uses sidebar/header instead).
 */

type NavItem = {
  label: string;
  icon: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', icon: '🏠', href: '/' },
  { label: 'Slots', icon: '🎰', href: '/games/slots' },
  { label: 'Blackjack', icon: '🃏', href: '/games/blackjack' },
  { label: 'Roulette', icon: '🎡', href: '/games/roulette' },
  { label: 'Wheel', icon: '🎲', href: '/games/wheel' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
      {/* Gradient fade overlay on top */}
      <div className="absolute -top-8 inset-x-0 h-16 bg-gradient-to-t from-gray-950 to-transparent pointer-events-none" />

      <div className="flex items-center justify-around px-2 py-2 pb-safe bg-gray-950/95 backdrop-blur-xl border-t border-yellow-600/20">
        {NAV_ITEMS.map(item => (
          <Link key={item.href} href={item.href} legacyBehavior>
            <a
              onClick={() => setActiveTab(item.href)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                activeTab === item.href || (pathname === '/' && item.href === '/')
                  ? 'text-yellow-400 bg-yellow-400/10 scale-105'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span className="text-[10px] font-medium tracking-wide uppercase">{item.label}</span>
            </a>
          </Link>
        ))}
      </div>
    </nav>
  );
}
