import { render, screen } from '@testing-library/react';
import React from 'react';
import Home from '../pages/index';

describe('Home page', () => {
  it('renders the Cashless Casino heading', () => {
    render(<Home />);
    expect(screen.getByText(/cashless casino/i)).toBeInTheDocument();
  });

  it('displays game selection cards', () => {
    render(<Home />);
    // Should show at least one game card link
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThanOrEqual(1);
  });

  it('renders the balance display', () => {
    render(<Home />);
    expect(screen.getByTestId('balance-display')).toBeInTheDocument();
  });
});
