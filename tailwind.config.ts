import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#1a2236',
        ivory: {
          DEFAULT: '#f7f4ee',
          dim: '#ede9e0',
        },
        gold: {
          DEFAULT: '#b8973a',
          light: '#d4af60',
          pale: 'rgba(184, 151, 58, 0.09)',
          mid: 'rgba(184, 151, 58, 0.18)',
        },
        ink: {
          DEFAULT: '#1a2236',
          mid: '#4a5568',
          muted: '#9a9080',
        },
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Cormorant Garamond', 'serif'],
        sans: ['var(--font-inter)', 'var(--font-noto-tc)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        field: '10px',
      },
      boxShadow: {
        sm: '0 1px 4px rgba(26, 34, 54, 0.06)',
        md: '0 2px 16px rgba(26, 34, 54, 0.08)',
        lesson: '0 6px 28px rgba(26, 34, 54, 0.20)',
      },
    },
  },
  plugins: [],
}

export default config
