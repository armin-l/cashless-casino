import React from 'react';

export default function Layout({ children, userId }: { children: React.ReactNode; userId?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white flex flex-col">
      {/* Balance Bar - Sticky Top */}
      <div className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-yellow-600/20 shadow-lg shadow-black/30" data-testid="balance-bar">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <span className="text-yellow-400 text-xl font-extrabold tracking-wider">VC</span>
          <span className="text-white text-2xl font-mono tabular-nums" data-testid="balance-display">1,000.00</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="text-center text-gray-600 text-sm py-6 border-t border-gray-800">
        <p>All currency is simulated virtual credit (VC). No real money involved.</p>
      </footer>
    </div>
  );
}
