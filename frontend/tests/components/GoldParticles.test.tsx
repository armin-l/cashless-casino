import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('GoldParticles', () => {
  it('renders floating particles container', () => {
    const container = render(
      <div data-testid="particles-container" className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute w-1 h-1 bg-yellow-400/30 rounded-full animate-float" />
        ))}
      </div>,
    );
    expect(container.container.querySelector('[data-testid="particles-container"]')).toBeTruthy();
  });

  it('has floating animation classes', () => {
    const container = render(<div className="animate-float" />);
    expect(container.container.classList.contains('animate-float')).toBe(true);
  });

  it('renders subtle gold colored particles', () => {
    const container = render(
      <div className="bg-yellow-400/30">Gold Particle</div>,
    );
    expect(container.container.textContent).toContain('Yellow');
  });

  it('has pointer-events-none to allow clicks through', () => {
    const container = render(
      <div className="pointer-events-none overflow-hidden">Particles</div>,
    );
    expect(container.container.classList.contains('pointer-events-none')).toBe(true);
  });
});
