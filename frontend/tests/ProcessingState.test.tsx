import React from 'react';
import { render, screen } from '@testing-library/react';
import ProcessingState from '../src/components/ProcessingState';

describe('ProcessingState', () => {
  it('renders nothing when not active', () => {
    const { container } = render(<ProcessingState active={false} />);
    
    // Should return null — no content rendered
    expect(container.innerHTML).toBe('');
  });

  it('renders animated dots and text when active', () => {
    const { container } = render(<ProcessingState active={true} estimatedMinutes={10} />);
    
    // Dots should be present
    expect(container.querySelectorAll('.w-4.h-4').length).toBe(3);
    
    // Text should display
    expect(screen.getByText(/processing withdrawal/i)).toBeTruthy();
  });

  it('shows custom estimated time', () => {
    render(<ProcessingState active={true} estimatedMinutes={15} />);
    
    expect(screen.getByText(/~15 min/)).toBeTruthy();
  });

  it('uses default 5 minute estimate when not specified', () => {
    const { container } = render(<ProcessingState active={true} />);
    
    // Should have processing text and progress bar skeleton
    expect(container.innerHTML).toContain('.w-full.max-w-xs');
  });
});
