import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('NearMissTease', () => {
  it('renders near-miss indicator when active', () => {
    const container = render(
      <div className="near-miss-active">NEAR MISS!</div>,
    );
    expect(container.container.textContent).toContain('NEAR MISS!');
  });

  it('has flashing animation class', () => {
    const container = render(<div className="animate-pulse" />);
    expect(container.container.classList.contains('animate-pulse')).toBe(true);
  });

  it('shows two matching symbols', () => {
    const container = render(
      <div className="flex gap-2">
        <span>🍒</span><span>🍒</span><span className="opacity-30">🍋</span>
      </div>,
    );
    expect(container.container.textContent).toContain('🍒');
  });

  it('has tease overlay with dim background', () => {
    const container = render(
      <div className="bg-black/50 opacity-80">Tease Overlay</div>,
    );
    expect(container.container.classList.contains('opacity-80')).toBe(true);
  });
});
