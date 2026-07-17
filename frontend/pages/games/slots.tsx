import { useState, useEffect } from 'react';
import Layout from '../src/components/Layout';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
const SYMBOLS = ['🍒', '🍋', '🔔', '💎', '7️⃣'];

export default function SlotsPage() {
  const [balance, setBalance] = useState(1000);
  const [reels, setReels] = useState(SYMBOLS.slice(0, 3));
  const [betAmount, setBetAmount] = useState(10);
  const [status, setStatus] = useState<{ msg: string; type: 'idle' | 'spinning' | 'win' | 'loss' }>({
    msg: 'Place your bet and spin!',
    type: 'idle',
  });

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(`${API_BASE}/wallet/balance?user_id=user123`);
        const data = await res.json();
        setBalance(data.balance);
      } catch (_) {}
    };
    poll();
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  }, []);

  async function spin() {
    setStatus({ msg: 'Spinning...', type: 'spinning' });
    try {
      const res = await fetch(
        `${API_BASE}/games/slots/spin?bet_amount=${betAmount}&user_id=user123`,
        { method: 'POST },
      );
      const data = await res.json();
      setReels(data.reels);
      if (data.result === 'win') {
        setStatus({ msg: `You won ${data.payout.toFixed(2)} VC!`, type: 'win' });
      } else {
        setStatus({ msg: 'No luck this time.', type: 'loss' });
      }
    } catch (_) {
      setStatus({ msg: 'Error spinning the reels.', type: 'loss' });
    }
  }

  return (
    <Layout>
      <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            🎰 Slots
          </h1>
          <p className="text-gray-400">Match all three symbols for a 10x payout!</p>
        </header>

        {/* Balance */}
        <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm border border-yellow-600/20 rounded-xl px-5 py-3 flex items-center justify-between mb-8">
          <span className="text-yellow-400 text-lg font-bold tracking-wider">VC</span>
          <span className="text-white text-2xl font-mono tabular-nums" data-testid="balance-display">
            {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Reels */}
        <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm border border-yellow-600/20 rounded-2xl p-10 flex items-center justify-center gap-4 mb-8">
          {reels.map((symbol, i) => (
            <div
              key={i}
              className={`w-20 h-20 flex items-center justify-center text-5xl font-bold rounded-xl transition-all duration-300 ${
                status.type === 'win'
                  ? 'bg-yellow-500/20 border-2 border-yellow-400 animate-pulse'
                  : 'bg-gray-900 bg-opacity-80 border border-gray-700'
              }`}
            >
              {symbol}
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          <label className="flex items-center gap-2 text-gray-300">
            <span className="text-sm font-medium">Bet:</span>
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              min={1}
              className="w-24 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white font-mono tabular-nums focus:outline-none focus:border-yellow-500"
            />
          </label>

          <button
            onClick={spin}
            disabled={status.type === 'spinning'}
            className={`px-8 py-3 font-bold rounded-xl transition-all ${
              status.type === 'spinning'
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : status.type === 'win'
                  ? 'bg-green-600 hover:bg-green-500 shadow-lg shadow-green-500/20 animate-pulse'
                  : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-gray-900 font-extrabold shadow-lg shadow-yellow-500/20'
            }`}
          >
            {status.type === 'spinning' ? 'Spinning...' : '🎲 SPIN'}
          </button>
        </div>

        {/* Status */}
        <p className="text-center text-lg mt-6 font-medium" data-testid="game-status">
          {status.msg}
        </p>
      </div>
    </main>
    </Layout>
  );
}
