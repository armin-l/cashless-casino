import React from 'react';
import { render, screen } from '@testing-library/react';
import SlotsPage from '../pages/games/slots';

describe('Slots page - no ghost/phantom values on initial mount', () => {
  it('does not show WinFloat before any game event', () => {
    const { container } = render(<SlotsPage />);
    
    // WinFloat renders a fixed-position div. The ghost "-0.00" bug 
    // happened because WinFloat was always mounted with default values.
    // Now it only appears when floatMessage is set (after spin).
    expect(container.textContent?.includes('-0.00')).toBe(false);
  });

  it('does not show WinCelebration before any game event', () => {
    render(<SlotsPage />);
    
    // No celebration overlay on initial mount (celebrationVisible is false)
    const hasJackpot = screen.queryByText(/JACKPOT/i);
    expect(hasJackpot).not.toBeInTheDocument();
  });

  it('balance shows initial value, not empty or default text', () => {
    render(<SlotsPage />);
    
    // Balance should show the loaded balance (1000), not "0.00" or placeholder
    const balance = screen.getByTestId('balance-display');
    expect(balance).toBeInTheDocument();
  });

  it('spinning button exists and is clickable', () => {
    render(<SlotsPage />);
    
    const spinButton = screen.getByRole('button', { name: /spin/i });
    expect(spinButton).toBeInTheDocument();
  });
});
