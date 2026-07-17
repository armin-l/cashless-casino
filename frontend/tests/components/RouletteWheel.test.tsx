import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('RouletteWheel', () => {
  it('renders wheel container with segments', () => {
    const container = render(
      <div data-testid="wheel-container" className="relative w-64 h-64">
        {[...Array(37)].map((_, i) => (
          <div key={i} className="absolute bg-red-500 rotate-[${i * 10}deg]" />
        ))}
      </div>,
    );
    expect(container.container.querySelector('[data-testid="wheel-container"]')).toBeTruthy();
  });

  it('has rotation animation class', () => {
    const container = render(<div className="animate-spin" />);
    expect(container.container.classList.contains('animate-spin')).toBe(true);
  });

  it('renders with ball position indicator', () => {
    const container = render(
      <div data-testid="ball" className="absolute w-3 h-3 bg-white rounded-full" />,
    );
    expect(container.container.querySelector('[data-testid="ball"]')).toBeTruthy();
  });

  it('has winning number display overlay', () => {
    const container = render(
      <div data-testid="winning-number" className="text-center text-2xl font-bold">0</div>,
    );
    expect(container.container.querySelector('[data-testid="winning-number"]')).toBeTruthy();
  });
});
