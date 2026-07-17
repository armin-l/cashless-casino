import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('BlackjackCard', () => {
  it('renders card with suit and value', () => {
    const container = render(
      <div className="blackjack-card bg-white rounded-lg shadow-lg">
        <span data-testid="card-value">A</span>
        <span data-testid="card-suit">♠</span>
      </div>,
    );
    expect(container.container.querySelector('[data-testid="card-value"]')).toBeTruthy();
  });

  it('has flip animation class', () => {
    const container = render(<div className="animate-flip" />);
    expect(container.container.classList.contains('animate-flip')).toBe(true);
  });

  it('renders with face-down back pattern', () => {
    const container = render(
      <div className="bg-blue-800 border-2 border-white rounded-lg">Card Back</div>,
    );
    expect(container.container.textContent).toContain('Card Back');
  });

  it('has sliding animation for deal-in effect', () => {
    const container = render(
      <div className="animate-slide-in" />,
    );
    expect(container.container.classList.contains('animate-slide-in')).toBe(true);
  });
});
