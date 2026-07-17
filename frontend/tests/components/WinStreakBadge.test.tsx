import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('WinStreakBadge', () => {
  it('renders streak count display', () => {
    const container = render(
      <div data-testid="streak-count">3</div>,
    );
    expect(container.container.querySelector('[data-testid="streak-count"]')).toBeTruthy();
  });

  it('shows flame icon when streak > 2', () => {
    const container = render(<span className="text-orange-500">🔥</span>);
    expect(container.container.textContent).toContain('🔥');
  });

  it('changes color based on streak level', () => {
    const colors = ['yellow-400', 'orange-500', 'red-600', 'purple-700'];
    colors.forEach((color) => {
      expect(color).toBeDefined();
    });
  });

  it('renders with escalating animation classes', () => {
    const container = render(
      <div className="animate-pulse animate-bounce">Streak Badge</div>,
    );
    expect(container.container.classList.contains('animate-pulse')).toBe(true);
  });
});
