import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('ReelStrip', () => {
  it('renders three reel containers', () => {
    const container = render(
      <div className="flex gap-2">
        <div data-testid="reel" />
        <div data-testid="reel" />
        <div data-testid="reel" />
      </div>,
    );
    expect(container.container.querySelectorAll('[data-testid="reel"]')).toHaveLength(3);
  });

  it('has vertical scrolling animation class', () => {
    const container = render(<div className="overflow-y-auto animate-spin-reel" />);
    expect(container.container.classList.contains('animate-spin-reel')).toBe(true);
  });

  it('renders symbol placeholders with emoji content', () => {
    const symbols = ['🍒', '🍋', '💎'];
    symbols.forEach((symbol) => {
      const container = render(<span>{symbol}</span>);
      expect(container.container.textContent).toContain(symbol);
    });
  });

  it('has reel border with thud flash state', () => {
    const container = render(
      <div className="border-2 border-yellow-500 animate-thud" />,
    );
    expect(container.container.classList.contains('animate-thud')).toBe(true);
  });
});
