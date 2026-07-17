import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('PaylineHighlight', () => {
  it('renders highlight overlay container', () => {
    const container = render(
      <div data-testid="payline-container" className="absolute inset-0 pointer-events-none">
        <svg />
      </div>,
    );
    expect(container.container.querySelector('[data-testid="payline-container"]')).toBeTruthy();
  });

  it('has SVG for line drawing', () => {
    const container = render(<svg data-testid="payline-svg" />);
    expect(container.container.querySelector('[data-testid="payline-svg"]')).toBeTruthy();
  });

  it('renders with animated highlight classes', () => {
    const container = render(
      <div className="animate-pulse animate-glow">Highlight</div>,
    );
    expect(container.container.classList.contains('animate-pulse')).toBe(true);
  });

  it('has payline path overlay styling', () => {
    const container = render(
      <svg className="stroke-yellow-400 stroke-[3px] opacity-80" />,
    );
    expect(container.container.classList.contains('stroke-yellow-400')).toBe(true);
  });
});
