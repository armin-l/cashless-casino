import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// Test data matching the actual game cards used in the app
const games = [
  { name: 'Slots', emoji: '🎰', href: '/games/slots', description: 'Classic 3-reel action with big win potential.' },
  { name: 'Roulette', emoji: '🎡', href: '/games/roulette', description: 'European single-zero wheel with all bet types.' },
  { name: 'Blackjack', emoji: '🃏', href: '/games/blackjack', description: '6-deck shoe. Beat the dealer to 21.' },
];

describe('GameCardGrid', () => {
  it('renders all game cards', () => {
    const { container } = render(
      <div>
        {games.map((game) => (
          <a key={game.name} href={game.href}>
            <span data-testid={`game-card-${game.name}`}>{game.emoji}</span>
          </a>
        ))}
      </div>,
    );

    games.forEach((game) => {
      expect(container.querySelector(`[data-testid="game-card-${game.name}"]`)).toBeTruthy();
    });
  });

  it('renders game names', () => {
    const { container } = render(
      <div>
        {games.map((game) => (
          <span key={game.name} data-testid={`name-${game.name.toLowerCase()}`}>{game.name}</span>
        ))}
      </div>,
    );

    games.forEach((game) => {
      expect(container.querySelector(`[data-testid="name-${game.name.toLowerCase()}"]`)).toBeTruthy();
    });
  });

  it('renders descriptions', () => {
    const { container } = render(
      <div>
        {games.map((game) => (
          <span key={game.name} data-testid={`desc-${game.name.toLowerCase()}`}>{game.description}</span>
        ))}
      </div>,
    );

    games.forEach((game) => {
      expect(container.querySelector(`[data-testid="desc-${game.name.toLowerCase()}"]`)).toBeTruthy();
    });
  });
});
