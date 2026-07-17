import { useEffect, useRef } from 'react';

interface UseRippleOptions {
  color?: string;
  scaleDuration?: number;
}

export function useRipple({ color = '#fbbf24', scaleDuration = 500 }: UseRippleOptions = {}) {
  const rippleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rippleRef.current;
    if (!el) return;

    let id = window.requestAnimationFrame(() => {
      const style = el.style;
      style.animation = `rippleScale ${scaleDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
      // Force reflow for animation restart on subsequent calls
    });

    return () => {
      window.cancelAnimationFrame(id);
      el.style.animation = '';
    };
  }, [scaleDuration]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement;
      if (!target || !(target instanceof HTMLElement)) return;

      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      (ripple as unknown as HTMLElement & { style: Record<string, string> }).style.left = `${x}px`;
      (ripple as unknown as HTMLElement & { style: Record<string, string> }).style.top = `${y}px`;
      (ripple as unknown as HTMLElement & { style: Record<string, string> }).style.backgroundColor = color;
      target.appendChild(ripple);

      const cleanup = () => {
        ripple.remove();
        target.removeEventListener('animationend', cleanup);
      };
      target.addEventListener('animationend', cleanup);
    };

    // Attach to all child elements
    el.querySelectorAll<HTMLElement>('*').forEach((child) => {
      child.style.position = child.style.position || 'relative';
      child.style.overflow = child.style.overflow || 'hidden';
      child.addEventListener('click', handleClick);
    });

    return () => {
      el.querySelectorAll<HTMLElement>('*').forEach((child) => {
        child.removeEventListener('click', handleClick);
      });
    };
  }, [color, el]);

  return { rippleRef: rippleRef as React.RefObject<HTMLDivElement | null> };
}
