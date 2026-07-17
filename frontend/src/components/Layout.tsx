import React from 'react';
import BalanceBar from './BalanceBar';
import Footer from './Footer';

export default function Layout({ children, userId }: { children: React.ReactNode; userId?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white flex flex-col">
      {/* Balance Bar - Sticky Top */}
      <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-yellow-600/20 shadow-lg shadow-black/30" data-testid="balance-bar-wrapper">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <BalanceBar userId={userId} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
