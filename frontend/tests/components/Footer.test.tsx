import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '../../src/components/Footer';

describe('Footer', () => {
  it('renders the legal disclaimer text', () => {
    const { container } = render(<Footer />);
    // Should contain "simulated virtual credit" text
    expect(container.textContent).toContain(/simulated virtual credit/i);
  });

  it('has no real money involved statement', () => {
    const { getByText } = render(<Footer />);
    expect(getByText(/no real money involved/i)).toBeTruthy();
  });
});
