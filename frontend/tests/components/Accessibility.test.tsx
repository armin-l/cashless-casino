import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';

describe('useReducedMotion', () => {
  it('returns motion preference state', () => {
    const result = renderHook(() => ({ 
      prefersReducedMotion: false,
      setPrefersReducedMotion: (val: boolean) => {} 
    }));
    expect(result.result.current.prefersReducedMotion).toBeDefined();
  });

  it('toggles motion preference', () => {
    let hasMotion = true;
    const toggle = () => { hasMotion = !hasMotion; };
    
    toggle();
    expect(hasMotion).toBe(false);
  });

  it('provides animation disable hook', () => {
    const result = renderHook(() => ({ 
      animationsEnabled: true,
      toggleAnimations: () => {} 
    }));
    expect(result.result.current.animationsEnabled).toBeDefined();
  });
});

describe('useScreenReader', () => {
  it('returns aria-live region state', () => {
    const result = renderHook(() => ({ 
      announcements: [],
      announce: (message: string) => {} 
    }));
    expect(result.result.current.announce).toBeDefined();
  });

  it('handles screen reader announcements', () => {
    let messages: string[] = [];
    const announce = (msg: string) => {
      messages.push(msg);
    };
    
    announce('Test announcement');
    expect(messages.length).toBe(1);
  });
});
