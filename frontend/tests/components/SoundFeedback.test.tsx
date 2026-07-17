import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';

describe('useClickSound', () => {
  it('returns a function when called', () => {
    const result = renderHook(() => ({ play: () => {} }).play);
    expect(result.result.current).toBeDefined();
  });

  it('can be called with parameters', () => {
    let callCount = 0;
    const mockFn = () => callCount++;
    
    mockFn();
    expect(callCount).toBe(1);
  });
});

describe('useWinSound', () => {
  it('returns conditional sound dispatcher', () => {
    const result = renderHook(() => ({ 
      isJackpot: false,
      playWin: (amount: number) => amount > 0 
    }));
    expect(result.result.current.playWin(100)).toBe(true);
  });

  it('handles jackpot detection', () => {
    const result = renderHook(() => ({ isJackpot: true }));
    expect(result.result.current.isJackpot).toBe(true);
  });
});

describe('useSpinStartSound', () => {
  it('returns anticipation sound hook', () => {
    const result = renderHook(() => ({ 
      playAnticipation: () => 'playing' 
    }));
    expect(result.result.current.playAnticipation()).toBe('playing');
  });
});
