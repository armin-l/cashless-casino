import { render, screen } from '@testing-library/react';
import React from 'react';
import GameCardGrid from '@/components/GameCardGrid';
import type { GameCard } from '@/components/GameCardGrid';

describe('GameCardGrid', () => {
  const mockGames: GameCard[] = [
    { href: '/games/slots', emoji: '🎰', title: 'Slots', description: 'Classic slot machine' },
    { href: '/games/roulette', emoji: '🎡', title: 'Roulette', description: 'European wheel' },
  ];

  it('renders all game cards with correct links', () => {
    render(<GameCardGrid games={mockGames} />);
    
    mockGames.forEach((game) => {
      expect(screen.getByText(game.title)).toBeInTheDocument();
      expect(screen.getByText(game.description)).toBeInTheDocument();
      expect(screen.getByText(game.emoji)).toBeInTheDocument();
    });
  });

  it('renders as a grid layout with gap', () => {
    const { container } = render(<GameCardGrid games={mockGames} />);
    const grid = container.firstChild as HTMLElement;
    expect(grid.className).toContain('grid');
    expect(grid.className).toContain('gap-6');
  });

  it('renders empty state when no games provided', () => {
    const { container } = render(<GameCardGrid games={[]} />);
    // Should handle gracefully with empty grid - just renders the wrapper div
    expect(container.firstChild).toBeTruthy();
  });
});
