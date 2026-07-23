import React, { useState } from 'react';
import Layout from '../../src/components/Layout';
import PageContainer from '../../src/components/PageContainer';
import Button from '../../src/components/Button';
import GoldParticles from '../../src/components/GoldParticles';
import ConfettiShower from '../../src/components/ConfettiShower';

type Prize = { label: string; amount: number; color: string };

const PRIZES: Prize[] = [
  { label: '💰', amount: 50, color: '#FFD700' },
  { label: '🎁', amount: 100, color: '#FF6B6B' },
  { label: '⭐', amount: 25, color: '#4ECDC4' },
  { label: '💎', amount: 500, color: '#95E1D3' },
  { label: '🍀', amount: 75, color: '#2C3E50' },
  { label: '🔥', amount: 150, color: '#F39C12' },
];

export default function WheelPage() {
  const [balance, setBalance] = useState(1000);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  function spin() {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setSelectedPrize(null);
    
    // Simulate spinning with random prize selection
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * PRIZES.length);
      const wonPrize = PRIZES[randomIndex];
      
      setBalance(prev => prev + wonPrize.amount);
      setSelectedPrize(wonPrize);
      setShowConfetti(true);
      setIsSpinning(false);
    }, 3000);
  }

  return (
    <Layout>
      <GoldParticles count={20} />
      {showConfetti && <ConfettiShower active />}
      <PageContainer title="Wheel of Fortune" icon="🎡">
        {/* Balance Display */}
        <div className="text-center mb-8">
          <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">Balance</p>
          <p className="text-yellow-400 font-mono tabular-nums text-3xl">{balance.toLocaleString()} VC</p>
        </div>

        {/* Wheel Display */}
        <div className="flex justify-center mb-8">
          <div className={`relative w-64 h-64 rounded-full border-8 border-yellow-600 ${isSpinning ? 'animate-spin' : ''}`} style={{ animationDuration: isSpinning ? '3s' }}>
            {/* Inner wheel */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
              {selectedPrize && !isSpinning && (
                <div className="text-4xl font-bold text-white">
                  <span className="text-6xl block mb-2">{selectedPrize.label}</span>
                  <span className="text-yellow-400">{selectedPrize.amount} VC</span>
                </div>
              )}
              {!selectedPrize && !isSpinning && (
                <div className="text-gray-400 text-lg">SPIN TO PLAY!</div>
              )}
            </div>
          </div>
        </div>

        {/* Prize Display */}
        {selectedPrize && !isSpinning && (
          <div className="text-center mb-8 p-4 bg-green-900/30 border border-green-500/30 rounded-lg">
            <p className="text-2xl font-bold text-green-400">YOU WON {selectedPrize.label} {selectedPrize.amount} VC!</p>
          </div>
        )}

        {/* Spin Button */}
        <div className="flex justify-center">
          <Button
            onClick={spin}
            disabled={isSpinning || balance < 10}
            className="px-12 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-xl shadow-lg shadow-yellow-500/20 hover:from-yellow-400 hover:to-yellow-500 disabled:opacity-30 transition-all active:scale-95"
          >
            {isSpinning ? 'SPINNING...' : 'SPIN THE WHEEL'}
          </Button>
        </div>

        {/* Prize List */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
          {PRIZES.map((prize, i) => (
            <div key={i} className={`p-3 rounded-lg border ${selectedPrize?.amount === prize.amount ? 'border-yellow-500 bg-yellow-900/20' : 'border-gray-700'}`}>
              <div className="text-center">
                <span className="text-2xl">{prize.label}</span>
                <p className="text-sm text-gray-400 mt-1">{prize.amount} VC</p>
              </div>
            </div>
          ))}
        </div>
      </PageContainer>
    </Layout>
  );
}
