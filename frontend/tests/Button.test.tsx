import { render, screen } from '@testing-library/react';
import React from 'react';
import Button from '@/components/Button';

describe('Button', () => {
  it('renders button with children text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies default casino-style classes (gold gradient)', () => {
    const { container } = render(<Button>Test</Button>);
    const btn = container.firstChild as HTMLElement;
    expect(btn.className).toContain('bg-gradient-to-r');
    expect(btn.className).toContain('from-yellow-500');
    expect(btn.className).toContain('to-yellow-600');
  });

  it('renders with custom className when provided', () => {
    const { container } = render(<Button className="custom">Test</Button>);
    expect(container.firstChild.className).toContain('custom');
  });

  it('is a button element (semantic HTML)', () => {
    render(<Button>Test</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} data-testid="btn">Test</Button>);
    screen.getByTestId('btn').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
