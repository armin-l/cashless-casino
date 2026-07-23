import React from 'react';
import { render, screen } from '@testing-library/react';
import ProgressiveJackpotMeter from '../src/components/ProgressiveJackpot';

describe('ProgressiveJackpotMeter', () => {
  it('renders label and current/target values', () => {
    const { container } = render(<ProgressiveJackpotMeter current={750} target={1000} />);
    
    // Meter bar should be present
    expect(container.querySelector('.h-full')).toBeTruthy();
    
    // Values should display
    expect(screen.getByText(/750 \/ 1,000/)).toBeTruthy();
  });

  it('caps at 100% when current exceeds target', () => {
    const { container } = render(<ProgressiveJackpotMeter current={1500} target={1000} />);
    
    // Width style should be capped at 100%
    const fill = container.querySelector('.h-full');
    expect(fill?.style.width).toBe('100%');
  });

  it('shows near-jackpot pulse effect when above 85%', () => {
    render(<ProgressiveJackpotMeter current={900} target={1000} />);
    
    // Should have the pulsing label
    expect(screen.getByText(/⚡ JACKPOT/)).toBeTruthy();
  });

  it('shows normal label when below threshold', () => {
    render(<ProgressiveJackpotMeter current={500} target={1000} />);
    
    // Should have the standard label without pulse
    expect(screen.getByText(/💰 JACKPOT/)).toBeTruthy();
  });

  it('respects custom icon prop', () => {
    const { container } = render(
      <ProgressiveJackpotMeter current={500} target={1000} icon="🏆" />
    );
    
    expect(container.innerHTML).toContain('🏆');
  });

  it('respects custom label prop', () => {
    const { container } = render(
      <ProgressiveJackpotMeter current={500} target={1000} label="MEGA POT" />
    );
    
    expect(container.innerHTML).toContain('MEGA POT');
  });

  it('shows almost-jackpot flash when above 95%', () => {
    render(<ProgressiveJackpotMeter current={980} target={1000} />);
    
    // Flash overlay should be present (animate-pulse class)
    const el = container.querySelector('.absolute.inset-0');
    expect(el?.className).toContain('animate-pulse');
  });
});
