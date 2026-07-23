import { useState, useCallback, useRef, useEffect } from 'react';

export interface SquishOptions {
  squishScale?: number;
  springDuration?: number;
}

export function useSquish({ squishScale = 0.95, springDuration = 300 }: SquishOptions = {}) {
  const [isPressed, setIsPressed] = useState(false);
  const animatingRef = useRef(false);

  const handlePointerDown = useCallback(() => {
    if (animatingRef.current) return;
    setIsPressed(true);
    
    const timeout = setTimeout(() => {
      setIsPressed(false);
      animatingRef.current = true;
      setTimeout(() => {
        animatingRef.current = false;
      }, springDuration);
    }, 150);

    return () => clearTimeout(timeout);
  }, [springDuration]);

  const handlePointerUp = useCallback(() => {
    setIsPressed(false);
  }, []);

  const handlePointerLeave = useCallback(() => {
    setIsPressed(false);
  }, []);

  const style: React.CSSProperties = isPressed 
    ? { transform: `scale(${squishScale})`, transition: 'transform 0.1s ease-out' }
    : { transform: 'scale(1)', transition: `transform ${springDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1)` };

  return { 
    isPressed, 
    style, 
    events: { onPointerDown: handlePointerDown, onPointerUp: handlePointerUp, onPointerLeave: handlePointerLeave }
  };
}
