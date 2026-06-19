import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          700: '#1d4ed8',
          900: '#1e3a5f',
        },
        surface: {
          DEFAULT: '#0f172a',
          card:    '#1e293b',
          border:  '#334155',
        },
        accent: {
          DEFAULT: '#6366f1',
          hover:   '#4f46e5',
        },
        success: '#22c55e',
        danger:  '#ef4444',
        warning: '#f59e0b',
      },
      fontFamily: {
        sans:  ['Inter', 'sans-serif'],
        mono:  ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        xl:  '1rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
}

export default config