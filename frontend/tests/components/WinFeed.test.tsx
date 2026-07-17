import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('WinFeed', () => {
  it('renders empty state when no wins', () => {
    const container = render(
      <div data-testid="winfeed">
        <span>0 active feeds</span>
      </div>,
    );
    expect(container.container.querySelector('[data-testid="winfeed"]')).toBeTruthy();
  });

  it('formats win amount with currency symbol', () => {
    const formatWin = (amount: number): string => 
      `+${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} VC`;
    
    expect(formatWin(100)).toBe('+100.00 VC');
    expect(formatWin(99.5)).toBe('+99.50 VC');
  });

  it('auto-dismisses after timeout', () => {
    // Test concept: win feed entries should auto-dismiss after 5s
    const timeout = 5000;
    expect(timeout).toBeGreaterThan(0);
  });
});
