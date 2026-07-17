/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Neon theme
        'neon-cyan': '#00f5ff',
        'neon-magenta': '#ff00ff',
        'neon-purple': '#8b00ff',
        // Gold theme
        'gold-felt': '#1a472a',
        'gold-accent': '#d4af37',
        'gold-dark': '#8b6914',
        // Dark Velvet theme
        'velvet-dark': '#0f0522',
        'velvet-purple': '#2d1b4e',
        'velvet-accent': '#b44acc',
      },
      animation: {
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'ticker-scroll': 'tickerScroll 30s linear infinite',
        'reel-spin': 'reelSpin 0.15s linear infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 5px theme(colors.neon-cyan), 0 0 10px theme(colors.neon-cyan)' },
          '50%': { boxShadow: '0 0 20px theme(colors.neon-cyan), 0 0 40px theme(colors.neon-cyan)' },
        },
        shimmer: {
          '0%': { opacity: '0.6' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0.6' },
        },
        tickerScroll: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        reelSpin: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
};
