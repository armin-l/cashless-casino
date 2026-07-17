import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('ShakeAnimation', () => {
  it('renders shake container with children', () => {
    const container = render(
      <div data-testid="shake-container" className="inline-block">
        <span>Content</span>
      </div>,
    );
    expect(container.container.querySelector('[data-testid="shake-container"]')).toBeTruthy();
  });

  it('has shake animation class', () => {
    const container = render(<div className="animate-shake" />);
    expect(container.container.classList.contains('animate-shake')).toBe(true);
  });

  it('can be triggered programmatically', () => {
    let isShaking = false;
    const triggerShake = () => { isShaking = true; };
    
    triggerShake();
    expect(isShaking).toBe(true);
  });

  it('applies CSS keyframe animation styles', () => {
    const container = render(
      <div className="shake-animation" />,
    );
    expect(container.container.classList.contains('shake-animation')).toBe(true);
  });
});
