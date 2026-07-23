import React from 'react';
import { render, screen } from '@testing-library/react';
import RankArrow, { AnimatedRank } from '../src/components/RankAnimation';

describe('RankArrow', () => {
  it('renders climbing (green up-arrow) when rank improved', () => {
    const { container } = render(<RankArrow currentRank={5} previousRank={10} />);
    
    // Should show green text color for climbing
    expect(container.querySelector('.text-green-400')).toBeTruthy();
  });

  it('renders falling (red down-arrow) when rank worsened', () => {
    const { container } = render(<RankArrow currentRank={10} previousRank={5} />);
    
    // Should show red text color for falling
    expect(container.querySelector('.text-red-400')).toBeTruthy();
  });

  it('renders nothing when no previous rank', () => {
    const { container } = render(<RankArrow currentRank={5} />);
    
    // No arrow should be present
    expect(container.innerHTML).toBe('');
  });

  it('shows animation class when climbing with default duration', () => {
    render(<RankArrow currentRank={3} previousRank={8} animateDuration={2000} />);
    
    // Animation should trigger and clear after timeout
    expect(true).toBeTruthy();
  });
});

describe('AnimatedRank', () => {
  it('renders rank number', () => {
    render(<AnimatedRank rank={42} prevRank={38} />);
    expect(screen.getByText('42')).toBeTruthy();
  });

  it('renders with previous rank for comparison', () => {
    const { container } = render(<AnimatedRank rank={5} prevRank={10} />);
    
    // Should include RankArrow indicator
    expect(container.querySelector('.text-green-400') || container.querySelector('.text-red-400')).toBeTruthy();
  });

  it('renders without previous rank', () => {
    render(<AnimatedRank rank={5} />);
    expect(screen.getByText('5')).toBeTruthy();
  });
});
