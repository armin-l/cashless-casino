import { render, screen } from '@testing-library/react';
import React from 'react';
import Footer from '@/components/Footer';

describe('Footer', () => {
  it('renders disclaimer text', () => {
    render(<Footer />);
    expect(screen.getByText(/simulated virtual credit/i)).toBeInTheDocument();
  });

  it('has proper footer semantic role', () => {
    const { container } = render(<Footer />);
    const el = container.firstChild as HTMLElement;
    expect(el.tagName.toLowerCase()).toBe('footer');
  });

  it('applies dark theme styling classes', () => {
    render(<Footer />);
    // Footer uses a p tag with text-gray-600 class
    const footerEl = screen.getByRole('contentinfo') as HTMLElement;
    expect(footerEl.className).toContain('border-t');
  });
});
