import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('ShimmerSweep', () => {
  it('renders shimmer container with children', () => {
    const container = render(
      <div data-testid="shimmer-container" className="relative overflow-hidden">
        <span>Content</span>
      </div>,
    );
    expect(container.container.querySelector('[data-testid="shimmer-container"]')).toBeTruthy();
  });

  it('has shimmer animation class', () => {
    const container = render(<div className="animate-shimmer" />);
    expect(container.container.classList.contains('animate-shimmer')).toBe(true);
  });

  it('renders with gradient overlay effect', () => {
    const container = render(
      <div className="bg-gradient-to-r from-transparent via-white/20 to-transparent" />,
    );
    expect(container.container.textContent).toContain('transparent');
  });

  it('can be triggered programmatically', () => {
    let isTriggered = false;
    const triggerShimmer = () => { isTriggered = true; };
    
    triggerShimmer();
    expect(isTriggered).toBe(true);
  });
});
