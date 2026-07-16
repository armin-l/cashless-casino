import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import BalanceBar from '@/components/BalanceBar';

describe('BalanceBar', () => {
  const mockFetch = jest.fn();
  
  beforeEach(() => {
    global.fetch = mockFetch;
  });

  afterEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders VC label and balance display', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ user_id: 'user123', balance: 500 }) });
    
    render(<BalanceBar />);
    
    expect(screen.getByText('VC')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId('balance-display')).toHaveTextContent(/500/);
    });
  });

  it('displays balance with formatting', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ user_id: 'user123', balance: 1500.5 }) });
    
    render(<BalanceBar />);
    await waitFor(() => {
      expect(screen.getByTestId('balance-display')).toHaveTextContent(/1,500\.50/);
    });
  });

  it('fetches balance for the given userId', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ user_id: 'user456', balance: 200 }) });
    
    render(<BalanceBar userId="user456" />);
    
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/wallet/balance?user_id=user456')
    );
  });

  it('handles fetch errors gracefully', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));
    
    render(<BalanceBar />);
    // Should not crash, should keep default balance
    expect(screen.getByText('VC')).toBeInTheDocument();
  });
});
