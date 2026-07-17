import React from 'react';
import Layout from '../src/components/Layout';
import PageContainer from '../src/components/PageContainer';
import GameCardGrid, { type GameCard } from '../src/components/GameCardGrid';

const GAMES: GameCard[] = [
  { href: '/games/slots', emoji: '🎰', title: 'Slots', description: 'Classic 3-reel action with big win potential.' },
  { href: '/games/roulette', emoji: '🎡', title: 'Roulette', description: 'European single-zero wheel with all bet types.' },
  { href: '/games/blackjack', emoji: '🃏', title: 'Blackjack', description: '6-deck shoe. Beat the dealer to 21.' },
];

export default function Home() {
  return (
    <Layout>
      <PageContainer>
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            Cashless Casino
          </h1>
          <p className="text-gray-400 text-lg">Play. Win. Enjoy — all with virtual credits.</p>
        </header>

        {/* Game Cards */}
        <GameCardGrid games={GAMES} />
      </PageContainer>
    </Layout>
  );
}
