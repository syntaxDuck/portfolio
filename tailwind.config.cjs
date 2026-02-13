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
        sans: ['Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
