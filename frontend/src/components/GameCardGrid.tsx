import Link from 'next/link';

interface GameCardProps {
  name: string;
  emoji: string;
  href: string;
  description: string;
}

const GAMES: GameCardProps[] = [
  { name: 'Slots', emoji: '🎰', href: '/games/slots', description: 'Classic 3-reel action with big win potential.' },
  { name: 'Roulette', emoji: '🎡', href: '/games/roulette', description: 'European single-zero wheel with all bet types.' },
  { name: 'Blackjack', emoji: '🃏', href: '/games/blackjack', description: '6-deck shoe. Beat the dealer to 21.' },
];

export default function GameCardGrid() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {GAMES.map((game) => (
        <Link href={game.href} key={game.name} className="group block cursor-pointer">
          <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm border border-yellow-600 border-opacity-20 rounded-2xl p-8 text-center hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/10 transition-all h-full">
            <div className="text-5xl mb-4 group-hover:animate-bounce">{game.emoji}</div>
            <h2 className="text-xl font-bold mb-2 text-yellow-400 group-hover:text-yellow-300">
              {game.name}
            </h2>
            <p className="text-gray-400 text-sm">{game.description}</p>
          </div>
        </Link>
      ))}
    </section>
  );
}
