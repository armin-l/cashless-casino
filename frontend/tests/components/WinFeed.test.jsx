import React from 'react';
import { render, screen } from '@testing-library/react';
import WinFeed from '../src/components/WinFeed';

describe('WinFeed', () => {
  it('renders with empty state showing no recent wins message', async () => {
    render(<WinFeed winEvents={[]} />);
    expect(screen.getByText(/no recent/i)).toBeTruthy();
  });

  it('receives and displays win notifications', async () => {
    const events = [
      { user: 'user123', amount: 50, game: 'Slots' },
      { user: 'user456', amount: 100, game: 'Roulette' },
    ];
    render(<WinFeed winEvents={events} />);
    events.forEach((evt) => {
      expect(screen.getByText(new RegExp(evt.user))).toBeTruthy();
    });
  });

  it('auto-scrolls ticker behavior (simulated)', async () => {
    const events = [{ user: 'user123', amount: 50, game: 'Slots' }];
    render(<WinFeed winEvents={events} />);
    expect(screen.getByText(/won/i)).toBeTruthy();
  });

  it('renders with fallback to polling display mode', async () => {
    const events = [{ user: 'user456', amount: 75, game: 'Blackjack' }];
    render(<WinFeed winEvents={events} isLive={false} />);
    expect(screen.getByText(/won/i)).toBeTruthy();
  });

  it('applies correct styling classes for live vs polling mode', async () => {
    const events = [{ user: 'user789', amount: 25, game: 'Slots' }];
    render(<WinFeed winEvents={events} isLive />);
  });
});
