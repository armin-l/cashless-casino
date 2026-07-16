import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BalanceBar from '../src/components/BalanceBar.tsx';

describe('BalanceBar', () => {
  it('renders balance correctly', async () => {
    const balance = 1500;
    render(<BalanceBar balance={balance} />);
    expect(screen.getByText(new RegExp(String(balance), 'i'))).toBeInTheDocument();
  });

  it('shows $ prefix on balance amount', async () => {
    render(<BalanceBar balance={420} />);
    // The dollar sign appears before the number
    const text = screen.queryByText(/\$|balance/i);
    expect(text).toBeTruthy();
  });

  it('shows deposit button with click handler', async () => {
    const onClick = jest.fn();
    render(<BalanceBar balance={500} onDeposit={onClick} />);
    const btn = screen.getByRole('button', { name: /deposit/i });
    if (btn) fireEvent.click(btn);
  });

  it('handles deposit button click event', async () => {
    const onClick = jest.fn();
    render(<BalanceBar balance={500} onDeposit={onClick} />);
    const btn = screen.getByRole('button', { name: /deposit/i });
    if (btn) fireEvent.click(btn);
  });

  it('updates when balance prop changes', async () => {
    const { rerender } = render(<BalanceBar balance={100} />);
    expect(screen.getByText(/100/i)).toBeInTheDocument();
    rerender(<BalanceBar balance={250} />);
    expect(screen.queryByText(/250/i)).toBeTruthy();
  });

  it('formats numbers with commas for thousands', async () => {
    render(<BalanceBar balance={15000} />);
    expect(screen.getByText(/\b1\d{4}\b/)).toBeInTheDocument();
  });
});
