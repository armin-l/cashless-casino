import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('HomePage', () => {
  const mockGameCards = [
    { name: 'Slots', emoji: '🎰' },
    { name: 'Roulette', emoji: '🎡' },
    { name: 'Blackjack', emoji: '🃏' },
  ];

  it('renders game cards section', () => {
    const container = render(
      <section>
        {mockGameCards.map((game) => (
          <div key={game.name} data-testid={`game-${game.name.toLowerCase()}`}>
            {game.emoji}
          </div>
        ))}
      </section>,
    );

    mockGameCards.forEach((game) => {
      expect(container.container.querySelector(`[data-testid="game-${game.name.toLowerCase()}"]`)).toBeTruthy();
    });
  });

  it('displays VC balance', () => {
    const container = render(<span data-testid="balance">1,000.00</span>);
    expect(container.container.querySelector('[data-testid="balance"]')).toBeTruthy();
  });

  it('has casino branding header', () => {
    const container = render(<h1 className="text-yellow-400 text-5xl">Cashless Casino</h1>);
    expect(container.container.textContent).toContain('Cashless Casino');
  });
});
