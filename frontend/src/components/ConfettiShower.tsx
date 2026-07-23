'use client';

import React, { useState, useEffect } from 'react';

/**
 * ConfettiShower — full-screen confetti animation for wins and celebrations.
 * 
 * Renders a canvas-based confetti burst that lasts ~3 seconds.
 * Supports both color presets (gold/sparkle/mixed) and custom colors.
 */

type ColorScheme = 'gold' | 'sparkle' | 'mixed' | string[];

interface Props {
  active: boolean;
  duration?: number; // ms (default: 3000)
  count?: number; // confetti pieces (default: 80)
  colors?: ColorScheme;
}

const COLOR_PALETTES = {
  gold: ['#FFD700', '#FFA500', '#FFEC8B', '#FFE4B5'],
  sparkle: ['#E0FFFF', '#FFF8DC', '#FFD700', '#FF69B4'],
  mixed: ['#FF6B6B', '#4ECDC4', '#FFD93D', '#A6E3E9', '#F5E6CA'],
};

export default function ConfettiShower({ active, duration = 3000, count = 80, colors }: Props) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const particlesRef = React.useRef<Particle[]>([]);
  const animFrameRef = React.useRef<number>(0);
  const startTimeRef = React.useRef<number>(0);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size to window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Pick colors
    const palette = Array.isArray(colors) ? colors : 
      colors === 'gold' ? COLOR_PALETTES.gold :
      colors === 'sparkle' ? COLOR_PALETTES.sparkle :
      COLOR_PALETTES.mixed;

    // Create particles
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(canvas));
    }
    
    startTimeRef.current = performance.now();
    particlesRef.current = particles;

    function animate() {
      const now = performance.now();
      const elapsed = now - startTimeRef.current;
      
      if (elapsed > duration) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'; // Trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.update();
        p.draw(ctx, palette);
      });
      
      animFrameRef.current = requestAnimationFrame(animate);
    }
    
    animate();

    return () => cancelAnimationFrame(animFrameRef.current);
  }, [active, duration, colors, count]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      aria-hidden="true"
    />
  );
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  gravity = 0.15;
  drag = 0.98;
  rotation: number;
  rotationSpeed: number;
  width: number;
  height: number;
  color: string;
  opacity: number;

  constructor(canvas: HTMLCanvasElement) {
    // Spawn from top center with spread
    const centerX = canvas.width / 2;
    this.x = centerX + (Math.random() - 0.5) * 100;
    this.y = -10;
    
    // Outward velocity
    this.vx = (Math.random() - 0.5) * 8;
    this.vy = Math.random() * -3 - 2;
    
    this.width = Math.random() * 6 + 4;
    this.height = Math.random() * 4 + 2;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.1;
    
    // Random color from palette assigned in draw()
    this.color = '';
    this.opacity = 1;
  }

  update() {
    this.vx *= this.drag;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
    
    // Fade near bottom of screen
    if (this.y > window.innerHeight * 0.8) {
      this.opacity = Math.max(0, this.opacity - 0.05);
    }
  }

  draw(ctx: CanvasRenderingContext2D, palette: string[]) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    
    // Assign random color from palette on each frame for shimmer effect
    if (!this.color || Math.random() < 0.1) {
      this.color = palette[Math.floor(Math.random() * palette.length)];
    }
    
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    
    ctx.restore();
  }
}
