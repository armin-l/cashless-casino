import React from 'react';

export interface GameCard {
  href: string;
  emoji: string;
  title: string;
  description: string;
}

export default function GameCardGrid({ games }: { games: GameCard[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {games.map((game) => (
        <a key={game.href} href={game.href} className="group block" data-testid={`game-card-${game.title}`}>
          <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm border border-yellow-600 border-opacity-20 
            rounded-2xl p-8 text-center hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/10 
            transition-all cursor-pointer">
            <div className="text-5xl mb-4 group-hover:animate-bounce">{game.emoji}</div>
            <h2 className="text-xl font-bold mb-2 text-yellow-400 group-hover:text-yellow-300">
              {game.title}
            </h2>
            <p className="text-gray-400 text-sm">{game.description}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
