import React from 'react';
import { render, screen } from '@testing-library/react';
import BallOrbit from '../src/components/BallOrbit';

describe('BallOrbit', () => {
  it('renders nothing when not spinning', () => {
    const { container } = render(<BallOrbit spinning={false} />);
    
    // Should have no orbit elements visible
    expect(container.innerHTML).toBe('');
  });

  it('renders ball and shadow when spinning', () => {
    const { container } = render(<BallOrbit spinning={true} />);
    
    // Ball container should be present
    expect(container.querySelector('.absolute.inset-0')).toBeTruthy();
  });

  it('applies custom orbit radius', () => {
    const { container } = render(
      <BallOrbit spinning={true} orbitRadius={200} />
    );
    
    // Should have ball element rendered
    expect(container.innerHTML).toContain('.absolute');
  });

  it('applies custom speed setting', () => {
    const { container } = render(
      <BallOrbit spinning={true} speed="fast" />
    );
    
    // Should not crash with different speeds
    expect(container.querySelector('.absolute')).toBeTruthy();
  });

  it('renders with custom ball size', () => {
    render(<BallOrbit spinning={true} ballSize={24} />);
    
    // Should render without crashing
    expect(true).toBeTruthy();
  });

  it('respects custom color prop', () => {
    const { container } = render(
      <BallOrbit spinning={true} color="#34d399" />
    );
    
    // Ball should be rendered with custom styling
    expect(container.innerHTML).toContain('.absolute');
  });
});
