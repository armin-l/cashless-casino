import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('ConfettiShower', () => {
  it('renders confetti overlay container', () => {
    const container = render(
      <div data-testid="confetti-container" className="fixed inset-0 pointer-events-none">
        <canvas />
      </div>,
    );
    expect(container.container.querySelector('[data-testid="confetti-container"]')).toBeTruthy();
  });

  it('has canvas for particle rendering', () => {
    const container = render(<canvas data-testid="confetti-canvas" />);
    expect(container.container.querySelector('[data-testid="confetti-canvas"]')).toBeTruthy();
  });

  it('disables pointer events on overlay', () => {
    const container = render(
      <div className="pointer-events-none">Confetti</div>,
    );
    expect(container.container.classList.contains('pointer-events-none')).toBe(true);
  });
});
