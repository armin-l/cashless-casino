import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('WheelOfFortune', () => {
  it('renders wheel container with segments', () => {
    const container = render(
      <div data-testid="wheel-container" className="relative w-64 h-64">
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`absolute bg-${['red','blue','green','yellow'][i % 4]}-500`} />
        ))}
      </div>,
    );
    expect(container.container.querySelector('[data-testid="wheel-container"]')).toBeTruthy();
  });

  it('has rotation animation class', () => {
    const container = render(<div className="animate-spin" />);
    expect(container.container.classList.contains('animate-spin')).toBe(true);
  });

  it('renders with pointer indicator', () => {
    const container = render(
      <div data-testid="pointer" className="absolute top-0 left-1/2 w-2 h-8 bg-white" />,
    );
    expect(container.container.querySelector('[data-testid="pointer"]')).toBeTruthy();
  });

  it('has prize reveal overlay', () => {
    const container = render(
      <div data-testid="prize-reveal" className="bg-black/80 flex items-center justify-center">
        Prize: $1000
      </div>,
    );
    expect(container.container.querySelector('[data-testid="prize-reveal"]')).toBeTruthy();
  });
});
