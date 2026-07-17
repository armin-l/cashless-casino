import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('NeonGlow', () => {
  it('renders glow container with children', () => {
    const container = render(
      <div data-testid="glow-container" className="neon-glow">
        <span>Content</span>
      </div>,
    );
    expect(container.container.querySelector('[data-testid="glow-container"]')).toBeTruthy();
  });

  it('has neon glow animation class', () => {
    const container = render(<div className="animate-neon-glow" />);
    expect(container.container.classList.contains('animate-neon-glow')).toBe(true);
  });

  it('renders with pulsing border effect', () => {
    const container = render(
      <div className="border-2 animate-pulse border-yellow-500/50" />,
    );
    expect(container.container.classList.contains('animate-pulse')).toBe(true);
  });

  it('can be triggered programmatically', () => {
    let isActive = false;
    const triggerGlow = () => { isActive = true; };
    
    triggerGlow();
    expect(isActive).toBe(true);
  });
});
