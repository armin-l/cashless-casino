import React, { useState, useEffect } from 'react';
import Layout from '../../src/components/Layout';
import AnimatedBalance from '../../src/components/AnimatedBalance';
import WinFloat from '../../src/components/WinFloat';
import WinCelebration from '../../src/components/WinCelebration';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
const SYMBOLS = ['🍒', '🍋', '🔔', '💎', '7️⃣'];
const PAYOUTS: Record<string, number> = { '7️⃣': 25, '💎': 15, '🔔': 8, '🍒': 3, '🍋': 2 };

type FloatState = { type: 'win' | 'loss'; amount: number; text: string } | null;

export default function SlotsPage() {
  const [displayBalance, setDisplayBalance] = useState(1000);
  const [reels, setReels] = useState(SYMBOLS.slice(0, 3));
  const [spinning, setSpinning] = useState([false, false, false]);
  const [betAmount, setBetAmount] = useState(10);
  const [message, setMessage] = useState('Place your bet and spin!');
  const [floatMessage, setFloatMessage] = useState<FloatState>(null);
  const [celebrationVisible, setCelebrationVisible] = useState(false);
  const [celebrationAmount, setCelebrationAmount] = useState(0);
  const [isJackpot, setIsJackpot] = useState(false);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(`${API_BASE}/wallet/balance?user_id=user123`);
        const data = await res.json();
        setDisplayBalance(data.balance);
      } catch (_) {}
    };
    poll();
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  }, []);

  async function spin() {
    if (spinning.some(Boolean)) return;
    setSpinning([true, true, true]);
    
    try {
      const res = await fetch(
        `${API_BASE}/games/slots/spin?bet_amount=${betAmount}&user_id=user123`,
        { method: 'POST' },
      );
      const data = await res.json();

      setReels(data.reels);
      
      if (data.result === 'win') {
        setFloatMessage({ type: 'win', amount: data.payout, text: `You won ${data.payout.toFixed(2)} VC!` });
        setCelebrationAmount(data.payout);
        setCelebrationVisible(true);
        setIsJackpot(data.isJackpot ?? false);
      } else {
        setFloatMessage({ type: 'loss', amount: betAmount, text: 'No luck this time.' });
        setMessage('No luck this time.');
      }
    } catch (_) {
      setDisplayBalance((prev) => Math.max(0, prev - betAmount));
      setFloatMessage({ type: 'loss', amount: betAmount, text: 'Error spinning the reels.' });
      setMessage('Error spinning the reels.');
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
        <div className="max-w-2xl mx-auto px-6 py-8">
          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent select-none">
              🎰 Slots
            </h1>
            <p className="text-gray-400">Match all three symbols for a 10x payout!</p>
          </header>

          {/* Balance */}
          <div className="bg-gray-800/70 backdrop-blur-sm border border-yellow-600/20 rounded-xl px-5 py-3 flex items-center justify-between mb-8">
            <span className="text-yellow-400 text-lg font-bold tracking-wider">VC</span>
            <AnimatedBalance targetBalance={displayBalance} className="text-white text-2xl" />
          </div>

          {/* Reels */}
          <div className="bg-gray-800/70 backdrop-blur-sm border border-yellow-600/20 rounded-2xl p-10 flex items-center justify-center gap-3 mb-8">
            {reels.map((symbol, i) => (
              <div
                key={i}
                className={`w-[72px] h-[72px] sm:w-[96px] sm:h-[96px] flex items-center justify-center text-4xl sm:text-5xl font-bold rounded-xl transition-all duration-200 ${
                  spinning[i]
                    ? 'bg-gray-700/80 border-2 border-yellow-600/30 animate-pulse'
                    : Object.keys(PAYOUTS).includes(symbol) && PAYOUTS[symbol as keyof typeof PAYOUTS] > 10
                      ? 'bg-yellow-500/10 border-2 border-yellow-400 shadow-lg shadow-yellow-500/10'
                      : 'bg-gray-900/80 border border-gray-700'
                }`}
              >
                {spinning[i] ? SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)] : symbol}
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
                onChange={(e) => setBetAmount(Math.max(1, Number(e.target.value)))}
                min={1}
                className="w-24 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white font-mono tabular-nums focus:outline-none focus:border-yellow-500"
              />
            </label>

            <button
              onClick={spin}
              disabled={spinning.some(Boolean)}
              className={`px-10 py-3 font-bold rounded-xl transition-all active:scale-[0.95] ${
                spinning.some(Boolean)
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-gray-900 font-extrabold shadow-lg shadow-yellow-500/20'
              }`}
            >
              {spinning.some(Boolean) ? 'Spinning...' : '🎲 SPIN'}
            </button>
          </div>

          {/* Status */}
          <p className="text-center text-lg mt-6 font-medium" data-testid="game-status">
            {message}
          </p>
        </div>

        {/* Win/Loss Float - only renders when floatMessage is set */}
        {floatMessage && (
          <WinFloat
            message={floatMessage.text}
            type={floatMessage.type}
            amount={floatMessage.amount}
          />
        )}

        {/* Big Win Celebration Overlay */}
        {celebrationVisible && (
          <WinCelebration
            amount={celebrationAmount}
            isJackpot={isJackpot}
            visible={celebrationVisible}
            onClose={() => setCelebrationVisible(false)}
          />
        )}
      </div>
    </Layout>
  );
}
