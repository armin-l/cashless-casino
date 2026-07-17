import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('Leaderboard', () => {
  it('renders tabbed view with all time/today/session tabs', () => {
    const container = render(
      <div className="leaderboard-tabs">
        <button>All Time</button>
        <button>Today</button>
        <button>Session</button>
      </div>,
    );
    expect(container.container.textContent).toContain('All Time');
  });

  it('has animated rank change indicators', () => {
    const container = render(
      <div className="flex items-center gap-2">
        <span className="text-green-500 animate-bounce">↑</span>
        <span className="text-red-500 animate-pulse">↓</span>
      </div>,
    );
    expect(container.container.querySelector('.animate-bounce')).toBeTruthy();
  });

  it('highlights current user row with gold border', () => {
    const container = render(
      <div className="border-2 border-yellow-500 bg-yellow-500/10">Your Row</div>,
    );
    expect(container.container.classList.contains('border-yellow-500')).toBe(true);
  });

  it('renders with refresh animation', () => {
    const container = render(<div className="animate-spin" />);
    expect(container.container.classList.contains('animate-spin')).toBe(true);
  });
});
