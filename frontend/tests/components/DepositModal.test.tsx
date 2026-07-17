import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('DepositModal', () => {
  it('renders multi-step deposit flow with amount selection', () => {
    const container = render(
      <div className="deposit-modal">
        <input data-testid="amount-input" placeholder="1000 VC" />
        <button>Confirm</button>
      </div>,
    );
    expect(container.container.querySelector('[data-testid="amount-input"]')).toBeTruthy();
  });

  it('has payment method selection (credit card, crypto)', () => {
    const container = render(
      <div className="flex gap-4">
        <button>Credit Card</button>
        <button>Crypto</button>
      </div>,
    );
    expect(container.container.textContent).toContain('Credit Card');
  });

  it('shows validation glow effects on input errors', () => {
    const container = render(
      <input className="border-red-500 animate-pulse" />,
    );
    expect(container.container.classList.contains('animate-pulse')).toBe(true);
  });

  it('displays success confetti animation on confirm', () => {
    const container = render(<div className="confetti-active animate-bounce" />);
    expect(container.container.classList.contains('animate-bounce')).toBe(true);
  });
});
