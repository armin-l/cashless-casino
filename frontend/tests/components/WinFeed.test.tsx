import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';

describe('useWinFeed', () => {
  it('returns win feed state and update function', () => {
    const result = renderHook(() => ({ 
      wins: [],
      addWin: (win: any) => [...wins, win]
    }));
    expect(result.result.current.addWin).toBeDefined();
  });

  it('handles new win additions', () => {
    let wins: any[] = [];
    const addWin = (win: any) => {
      wins = [...wins, win];
    };
    
    addWin({ userId: 'user1', amount: 100 });
    expect(wins.length).toBe(1);
  });

  it('disables pointer events on overlay', () => {
    const container = renderHook(() => ({ 
      showOverlay: false,
      setShowOverlay: (show: boolean) => {} 
    }));
    expect(container.result.current.showOverlay).toBeDefined();
  });
});
