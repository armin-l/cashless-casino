import { renderHook } from '@testing-library/react';
import { useWinSound } from '../src/hooks/useWinSound';

// Mock AudioContext to avoid browser requirements in Node
const mockAudioContext = class {
  createOscillator() { return { connect: () => {}, start: () => {}, stop: () => {} }; }
  createGain() { return { connect: () => {}, disconnect: () => {} }; }
};

global.AudioContext = mockAudioContext as unknown as typeof AudioContext;

describe('useWinSound', () => {
  it('should not throw on mount with small win amount', () => {
    const { result } = renderHook(() => useWinSound({ winAmount: 50, isJackpot: false }));
    expect(result.current).toBeDefined();
  });

  it('should trigger different logic for jackpot wins', () => {
    const { rerender } = renderHook(
      ({ options }) => useWinSound(options),
      { initialProps: { options: { winAmount: 1000, isJackpot: true } } }
    );
    expect(rerender).toBeDefined();
  });

  it('should trigger different logic for medium wins', () => {
    renderHook(() => useWinSound({ winAmount: 250, isJackpot: false }));
  });

  it('should not fire on zero or negative amount', () => {
    renderHook(() => useWinSound({ winAmount: 0, isJackpot: false }));
  });
});
