import React, { useState, useEffect } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

export default function BalanceBar({ userId = 'user123' }: { userId?: string }) {
  const [balance, setBalance] = useState(1000);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(`${API_BASE}/wallet/balance?user_id=${userId}`);
        const data = await res.json();
        setBalance(data.balance);
      } catch (_) {}
    };
    poll();
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  }, [userId]);

  return (
    <div className="bg-gray-900 bg-opacity-80 backdrop-blur-sm border border-yellow-600 border-opacity-30 rounded-xl px-6 py-3 flex items-center gap-4">
      <span className="text-yellow-400 text-lg font-bold tracking-wider">VC</span>
        <span className="text-white text-2xl font-mono tabular-nums" data-testid="balance-display">
          {balance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </span>
    </div>
  );
}
