import React, { useState } from 'react';
import Layout from '../../src/components/Layout';
import PageContainer from '../../src/components/PageContainer';
import Button from '../../src/components/Button';
import GoldParticles from '../../src/components/GoldParticles';
import WinFloat from '../../src/components/WinFloat';

type BetType = 'number' | 'color' | 'odd-even' | 'high-low';

const ROULETTE_NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 1, 20,
  14, 31, 9, 22, 18, 29, 7, 12, 28, 5, 26, 3, 35, 10, 24, 16, 33, 1
];

const RED_NUMBERS = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);

function isRed(num: number): boolean {
  return num !== 0 && RED_NUMBERS.has(num);
}

export default function RoulettePage() {
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(25);
  const [betType, setBetType] = useState<BetType>('number');
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<{ number: number; color: string } | null>(null);
  const [winFloat, setWinFloat] = useState<{ type: 'win' | 'loss'; amount: number; text: string } | null>(null);

  function spin() {
    if (isSpinning || balance < betAmount) return;
    
    setBalance(prev => prev - betAmount);
    setIsSpinning(true);
    setResult(null);
    setWinFloat(null);
    
    // Simulate spinning with random result
    setTimeout(() => {
      const winningNumber = Math.floor(Math.random() * 37); // 0-36
      const color = winningNumber === 0 ? 'black' : (isRed(winningNumber) ? 'red' : 'black');
      
      setResult({ number: winningNumber, color });
      
      // Check if bet wins
      let won = false;
      let winAmount = 0;
      
      if (betType === 'number' && selectedNumber === winningNumber) {
        won = true;
        winAmount = betAmount * 35;
      } else if (betType === 'color') {
        const colorMatch = color === (selectedNumber === 1 ? 'red' : 'black');
        if (colorMatch) {
          won = true;
          winAmount = betAmount * 2;
        }
      } else if (betType === 'odd-even') {
        if ((winningNumber > 0 && selectedNumber === 1) !== (winningNumber % 2 === 0)) {
          won = true;
          winAmount = betAmount * 2;
        }
      } else if (betType === 'high-low') {
        const isHigh = winningNumber > 18;
        if ((selectedNumber === 1) === isHigh && winningNumber !== 0) {
          won = true;
          winAmount = betAmount * 2;
        }
      }
      
      if (won) {
        setBalance(prev => prev + betAmount + winAmount);
        setWinFloat({ type: 'win', amount: winAmount, text: `${color.toUpperCase()} ${winningNumber} - WIN!` });
      } else {
        setWinFloat({ type: 'loss', amount: 0, text: 'No win this spin' });
      }
      
      setIsSpinning(false);
    }, 3000);
  }

  return (
    <Layout>
      <GoldParticles count={15} />
      <PageContainer title="Roulette" icon="🎡">
        {/* Balance Display */}
        <div className="text-center mb-8">
          <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">Balance</p>
          <p className="text-yellow-400 font-mono tabular-nums text-3xl">{balance.toLocaleString()} VC</p>
        </div>

        {/* Roulette Wheel */}
        <div className="flex justify-center mb-8">
          <RouletteWheel spinning={isSpinning} result={result} />
        </div>

        {/* Result Display */}
        {result && !isSpinning && (
          <div className={`text-center mb-8 p-4 rounded-lg ${
            winFloat?.type === 'win' ? 'bg-green-900/30 border border-green-500/30' : 'bg-red-900/30 border border-red-500/30'
          }`}>
            <p className={`text-4xl font-bold ${
              winFloat?.type === 'win' ? 'text-green-400' : 'text-red-400'
            }`}>
              {result.number} ({result.color.toUpperCase()})
            </p>
          </div>
        )}

        {/* Betting Controls */}
        <div className="flex flex-col gap-4">
          {/* Bet Type Selection */}
          <div className="flex justify-center gap-2 mb-4">
            {(['number', 'color', 'odd-even', 'high-low'] as const).map(type => (
              <Button
                key={type}
                onClick={() => setBetType(type)}
                className={`px-4 py-2 ${betType === type ? 'bg-yellow-500 text-black' : 'bg-gray-800 border border-gray-700'}`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>

          {/* Number Selection for number bet */}
          {betType === 'number' && (
            <div className="flex flex-wrap justify-center gap-1 mb-4">
              {[0, ...Array.from({length: 36}, (_, i) => i + 1)].map(num => (
                <button
                  key={num}
                  onClick={() => setSelectedNumber(num)}
                  disabled={isSpinning}
                  className={`w-8 h-8 rounded-full text-xs font-bold ${
                    num === selectedNumber ? 'bg-yellow-500' : 
                    isRed(num) ? 'bg-red-600' : 'bg-black border border-gray-700'
                  } disabled:opacity-30`}
                >
                  {num}
                </button>
              ))}
            </div>
          )}

          {/* Color Selection for color bet */}
          {betType === 'color' && (
            <div className="flex justify-center gap-4 mb-4">
              {[1, 0].map(color => (
                <button
                  key={color}
                  onClick={() => setBetType('color')}
                  disabled={isSpinning}
                  className={`w-16 h-16 rounded-full border-2 ${
                    color === 1 ? 'bg-red-600' : 'bg-black border-gray-700'
                  } disabled:opacity-30`}
                />
              ))}
            </div>
          )}

          {/* Bet Amount */}
          <div className="flex justify-center gap-2 mb-4">
            {[10, 25, 50, 100].map(amt => (
              <Button
                key={amt}
                onClick={() => setBetAmount(amt)}
                disabled={isSpinning}
                className={`px-4 py-2 ${betAmount === amt ? 'bg-yellow-500 text-black' : 'bg-gray-800 border border-gray-700'}`}
              >
                {amt}
              </Button>
            ))}
          </div>

          {/* Spin Button */}
          <div className="flex justify-center">
            <Button
              onClick={spin}
              disabled={isSpinning || balance < betAmount}
              className="px-12 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-xl shadow-lg shadow-yellow-500/20 hover:from-yellow-400 hover:to-yellow-500 disabled:opacity-30 transition-all active:scale-95"
            >
              {isSpinning ? 'SPINNING...' : 'SPIN'}
            </Button>
          </div>
        </div>

        {/* Win Float Notification */}
        {winFloat && <WinFloat state={winFloat} />}
      </PageContainer>
    </Layout>
  );
}

// Simplified Roulette Wheel Component
function RouletteWheel({ spinning, result }: { spinning: boolean; result: { number: number; color: string } | null }) {
  return (
    <div className={`relative w-64 h-64 rounded-full border-8 border-yellow-600 ${spinning ? 'animate-spin' : ''}`} style={{ animationDuration: spinning ? '3s' : undefined }}>
      {/* Inner wheel */}
      <div className="absolute inset-4 rounded-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        {result && !spinning && (
          <div className={`text-6xl font-bold ${
            result.color === 'red' ? 'text-red-500' : 
            result.number === 0 ? 'text-green-500' : 'text-black'
          }`}>
            {result.number}
          </div>
        )}
      </div>
    </div>
  );
}
