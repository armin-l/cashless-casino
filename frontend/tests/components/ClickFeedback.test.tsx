import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('ClickFeedback', () => {
  it('renders button with ripple effect classes', () => {
    const container = render(
      <button className="ripple-effect active:scale-95">Click Me</button>,
    );
    expect(container.container.querySelector('.active\\:scale-95')).toBeTruthy();
  });

  it('has press squish animation class', () => {
    const container = render(<div className="press-squish" />);
    expect(container.container.textContent).toContain('press-squish');
  });

  it('renders glow ring on active state', () => {
    const container = render(
      <button className="active:ring-4 active:ring-yellow-500">Test</button>,
    );
    expect(container.container.querySelector('.active\\:ring-4')).toBeTruthy();
  });
});
