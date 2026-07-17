import { useState, useEffect } from 'react';

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const animationsEnabled = !prefersReducedMotion;

  return { prefersReducedMotion, animationsEnabled };
}

export function useScreenReader() {
  const [announcements, setAnnouncements] = useState<string[]>([]);
  
  const announce = (message: string) => {
    setAnnouncements((prev) => [...prev, message]);
  };

  return { announcements, announce };
}
