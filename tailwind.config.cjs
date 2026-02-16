/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          dark: 'oklch(0.1 0 244)',
          DEFAULT: 'oklch(0.96 0 244)',
        },
        bg2: {
          dark: 'oklch(0.15 0 244)',
          DEFAULT: 'oklch(0.92 0 244)',
        },
        bg3: {
          dark: 'oklch(0.2 0 244)',
          DEFAULT: 'oklch(1 0 244)',
        },
        text: {
          dark: 'oklch(0.96 0 244)',
          DEFAULT: 'oklch(0.15 0 244)',
        },
        muted: {
          dark: 'oklch(0.76 0 244)',
          DEFAULT: 'oklch(0.4 0 244)',
        },
        primary: {
          dark: 'oklch(0.76 0.1 244)',
          DEFAULT: 'oklch(0.4 0.1 244)',
        },
        secondary: {
          dark: 'oklch(0.76 0.1 64)',
          DEFAULT: 'oklch(0.4 0.1 64)',
        },
        danger: {
          dark: 'oklch(0.7 0.05 30)',
          DEFAULT: 'oklch(0.5 0.05 30)',
        },
        warning: {
          dark: 'oklch(0.7 0.05 100)',
          DEFAULT: 'oklch(0.5 0.05 100)',
        },
        success: {
          dark: 'oklch(0.7 0.05 160)',
          DEFAULT: 'oklch(0.5 0.05 160)',
        },
        info: {
          dark: 'oklch(0.7 0.05 260)',
          DEFAULT: 'oklch(0.5 0.05 260)',
        },
        border: {
          dark: 'oklch(0.4 0 244)',
          DEFAULT: 'oklch(0.6 0 244)',
        },
        borderMuted: {
          dark: 'oklch(0.3 0 244)',
          DEFAULT: 'oklch(0.7 0 244)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', 'Monaco', 'monospace'],
        display: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, oklch(0.4 0.1 244), oklch(0.76 0.1 64))',
        'gradient-primary-dark': 'linear-gradient(135deg, oklch(0.76 0.1 244), oklch(0.76 0.1 64))',
        'gradient-accent': 'linear-gradient(135deg, oklch(0.4 0.1 64), oklch(0.4 0.1 244))',
        'gradient-accent-dark': 'linear-gradient(135deg, oklch(0.76 0.1 64), oklch(0.76 0.1 244))',
        'gradient-bg': 'linear-gradient(180deg, oklch(0.96 0 244), oklch(0.92 0 244))',
        'gradient-bg-dark': 'linear-gradient(180deg, oklch(0.1 0 244), oklch(0.15 0 244))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
