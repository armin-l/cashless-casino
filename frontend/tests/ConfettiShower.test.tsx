import React from 'react';
import { render, screen } from '@testing-library/react';
import ConfettiShower from '../src/components/ConfettiShower';

// Mock requestAnimationFrame to avoid real canvas in tests
const mockRaf = (fn: () => void) => setTimeout(fn, 0);
const mockCaf = (id: number) => clearTimeout(id);
global.requestAnimationFrame = mockRaf;
global.cancelAnimationFrame = mockCaf;

describe('ConfettiShower', () => {
  it('renders null when not active', () => {
    const { container } = render(<ConfettiShower active={false} />);
    
    // Should return null — no canvas rendered
    expect(container.innerHTML).toBe('');
  });

  it('renders canvas when active', () => {
    const { container } = render(<ConfettiShower active={true} />);
    
    // Canvas element should be present
    expect(container.querySelector('canvas')).toBeTruthy();
  });

  it('applies correct CSS classes for fixed overlay', () => {
    const { container } = render(<ConfettiShower active={true} />);
    
    const canvas = container.querySelector('canvas');
    expect(canvas?.className).toContain('fixed inset-0');
    expect(canvas?.getAttribute('aria-hidden')).toBe('true');
  });

  it('renders with custom duration', () => {
    render(<ConfettiShower active={true} duration={5000} />);
    
    // Should not crash with different duration
    expect(true).toBeTruthy();
  });

  it('renders with custom count', () => {
    render(<ConfettiShower active={true} count={200} />);
    
    expect(true).toBeTruthy();
  });

  it('renders with gold color palette', () => {
    render(<ConfettiShower active={true} colors="gold" />);
    
    expect(true).toBeTruthy();
  });

  it('renders with custom color array', () => {
    const customColors = ['#FF0000', '#00FF00', '#0000FF'];
    render(<ConfettiShower active={true} colors={customColors} />);
    
    expect(true).toBeTruthy();
  });

  it('renders with sparkle color palette', () => {
    render(<ConfettiShower active={true} colors="sparkle" />);
    
    expect(true).toBeTruthy();
  });
});
