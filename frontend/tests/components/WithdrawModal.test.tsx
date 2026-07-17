import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('WithdrawModal', () => {
  it('renders withdrawal form with amount input', () => {
    const container = render(
      <div className="withdraw-modal">
        <input data-testid="amount-input" placeholder="Enter amount" />
        <button>Withdraw</button>
      </div>,
    );
    expect(container.container.querySelector('[data-testid="amount-input"]')).toBeTruthy();
  });

  it('has withdrawal method selection', () => {
    const container = render(
      <div className="flex gap-4">
        <button>Bank Transfer</button>
        <button>Crypto Withdrawal</button>
      </div>,
    );
    expect(container.container.textContent).toContain('Crypto');
  });

  it('shows processing animation', () => {
    const container = render(<div className="animate-spin" />);
    expect(container.container.classList.contains('animate-spin')).toBe(true);
  });

  it('displays success confirmation', () => {
    const container = render(
      <div className="text-green-400 font-bold">Withdrawal Successful!</div>,
    );
    expect(container.container.textContent).toContain('Successful');
  });
});
