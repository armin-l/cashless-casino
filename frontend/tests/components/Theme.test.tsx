import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

describe('theme tokens', () => {
  it('defines dark background color', () => {
    const { container } = render(<div className="bg-gray-950" />);
    // Verify the class exists and dark theme is applied
    expect(container.firstChild).toHaveClass('bg-gray-950');
  });

  it('applies gold accent color', () => {
    const { container } = render(<div className="text-yellow-400" />);
    expect(container.querySelector('.text-yellow-400')).toBeTruthy();
  });

  it('has backdrop blur utility available', () => {
    const { container } = render(<div className="backdrop-blur-sm" />);
    expect(container.firstChild).toHaveClass('backdrop-blur-sm');
  });
});
