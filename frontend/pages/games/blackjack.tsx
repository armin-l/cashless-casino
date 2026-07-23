import React, { useState } from 'react';
import Layout from '../../src/components/Layout';
import PageContainer from '../../src/components/PageContainer';
import Button from '../../src/components/Button';
import Card from '../../src/components/Card';
import ShakeAnimation from '../../src/components/ShakeAnimation';
import BlackJackCard from '../../src/components/BlackjackCard';

type Hand = { player: number[]; dealer: number[] };
type GameState = 'betting' | 'dealing' | 'player-turn' | 'dealer-turn' | 'result';

const SUITS = ['♠', '♥', '♦', '♣'];
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function randomCard() {
  return {
    suit: SUITS[Math.floor(Math.random() * SUITS.length)],
    value: VALUES[Math.floor(Math.random() * VALUES.length)]
  };
}

function cardValue(card: any): number {
  if (['J', 'Q', 'K'].includes(card.value)) return 10;
  if (card.value === 'A') return 11;
  return parseInt(card.value);
}

function handTotal(hand: any[]): number {
  let total = 0;
  let aces = 0;
  for (const card of hand) {
    total += cardValue(card);
    if (card.value === 'A') aces++;
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
}

export default function BlackjackPage() {
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(25);
  const [playerHand, setPlayerHand] = useState<any[]>([]);
  const [dealerHand, setDealerHand] = useState<any[]>([]);
  const [gameState, setGameState] = useState<GameState>('betting');
  const [result, setResult] = useState<string | null>(null);

  function deal() {
    if (balance < betAmount) return;
    
    setBalance(prev => prev - betAmount);
    const pHand = [randomCard(), randomCard()];
    const dHand = [randomCard(), randomCard()];
    
    setPlayerHand(pHand);
    setDealerHand(dHand);
    setGameState('player-turn');
    setResult(null);
  }

  function hit() {
    if (gameState !== 'player-turn') return;
    const newCard = randomCard();
    const newHand = [...playerHand, newCard];
    
    if (handTotal(newHand) > 21) {
      setPlayerHand(newHand);
      setResult('BUST!');
      setGameState('result');
      return;
    }
    
    setPlayerHand(newHand);
  }

  function stand() {
    if (gameState !== 'player-turn') return;
    setGameState('dealer-turn');
    
    setTimeout(() => dealerPlay(), 1000);
  }

  function dealerPlay() {
    let dHand = [...dealerHand];
    
    while (handTotal(dHand) < 17) {
      dHand.push(randomCard());
    }
    
    setDealerHand(dHand);
    
    const pTotal = handTotal(playerHand);
    const dTotal = handTotal(dHand);
    
    if (dTotal > 21 || pTotal > dTotal) {
      setResult('YOU WIN!');
      setBalance(prev => prev + betAmount * 2);
    } else if (pTotal === dTotal) {
      setResult('PUSH');
      setBalance(prev => prev + betAmount);
    } else {
      setResult('DEALER WINS');
    }
    
    setGameState('result');
  }

  return (
    <Layout>
      <PageContainer title="Blackjack" icon="🃏">
        {/* Balance Display */}
        <div className="text-center mb-8">
          <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">Balance</p>
          <p className="text-yellow-400 font-mono tabular-nums text-3xl">{balance.toLocaleString()} VC</p>
        </div>

        {/* Dealer Hand */}
        <ShakeAnimation active={gameState === 'dealing'}>
          <div className="mb-8">
            <h2 className="text-gray-400 text-sm uppercase tracking-wider mb-4 text-center">Dealer&apos;s Hand</h2>
            <div className="flex justify-center gap-2 min-h-[160px]">
              {dealerHand.map((card, i) => (
                <BlackjackCard 
                  key={i} 
                  card={gameState === 'dealing' && i === 1 ? null : card}
                  faceDown={gameState === 'dealing' && i === 1}
                />
              ))}
            </div>
          </div>
        </ShakeAnimation>

        {/* Player Hand */}
        <div className="mb-8">
          <h2 className="text-gray-400 text-sm uppercase tracking-wider mb-4 text-center">Your Hand ({handTotal(playerHand)})</h2>
          <div className="flex justify-center gap-2 min-h-[160px]">
            {playerHand.map((card, i) => (
              <BlackjackCard key={i} card={card} />
            ))}
          </div>
        </div>

        {/* Result Display */}
        {result && gameState === 'result' && (
          <div className="text-center mb-8">
            <p className={`text-4xl font-bold ${
              result.includes('WIN') ? 'text-green-400' : 
              result === 'PUSH' ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {result}
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {gameState === 'betting' && (
            <>
              {[25, 50, 100, 250].map(bet => (
                <Button
                  key={bet}
                  onClick={() => setBetAmount(bet)}
                  className={`px-4 py-2 ${betAmount === bet ? 'bg-yellow-500' : 'bg-gray-800 border border-gray-700'}`}
                >
                  {bet}
                </Button>
              ))}
              <Button onClick={deal} disabled={balance < 25} className="px-8 py-3 bg-yellow-500 text-black font-bold">
                DEAL
              </Button>
            </>
          )}

          {gameState === 'player-turn' && (
            <>
              <Button onClick={hit} disabled={handTotal(playerHand) >= 21} className="px-8 py-3 bg-green-600 text-white font-bold">
                HIT
              </Button>
              <Button onClick={stand} disabled={handTotal(playerHand) <= 17} className="px-8 py-3 bg-red-600 text-white font-bold">
                STAND
              </Button>
            </>
          )}

          {gameState === 'result' && (
            <Button onClick={() => setGameState('betting')} className="px-8 py-3 bg-yellow-500 text-black font-bold">
              PLAY AGAIN
            </Button>
          )}
        </div>
      </PageContainer>
    </Layout>
  );
}
