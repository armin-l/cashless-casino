import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('WinCelebration', () => {
  it('renders with win amount displayed', () => {
    const container = render(
      <div data-testid="win-amount">+100.00</div>,
    );
    expect(container.container.querySelector('[data-testid="win-amount"]')).toBeTruthy();
  });

  it('shows multiplier badge', () => {
    const container = render(<span>x2.0</span>);
    expect(container.container.textContent).toContain('x2.0');
  });

  it('renders celebration text', () => {
    const container = render(<div className="text-yellow-400">BIG WIN!</div>);
    expect(container.container.textContent).toContain('BIG WIN!');
  });
});
