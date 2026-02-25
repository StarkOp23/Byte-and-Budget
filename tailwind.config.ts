import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        dark: {
          50: '#f8f8f8',
          100: '#e8e8e8',
          200: '#d0d0d0',
          300: '#a8a8a8',
          400: '#787878',
          500: '#484848',
          600: '#282828',
          700: '#1e1e1e',
          800: '#141414',
          900: '#0a0a0a',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-fira-code)', 'monospace'],
      },
      typography: (theme: (path: string) => string) => ({
        DEFAULT: {
          css: {
            maxWidth: '68ch',
            color: theme('colors.zinc.700'),
            a: {
              color: theme('colors.brand.600'),
              '&:hover': { color: theme('colors.brand.700') },
            },
            h1: { fontFamily: 'var(--font-playfair)', fontWeight: '700' },
            h2: { fontFamily: 'var(--font-playfair)', fontWeight: '700' },
            h3: { fontFamily: 'var(--font-playfair)', fontWeight: '600' },
          },
        },
        dark: {
          css: {
            color: theme('colors.zinc.300'),
            a: { color: theme('colors.brand.400') },
            h1: { color: theme('colors.zinc.100') },
            h2: { color: theme('colors.zinc.100') },
            h3: { color: theme('colors.zinc.200') },
            strong: { color: theme('colors.zinc.100') },
            blockquote: {
              color: theme('colors.zinc.400'),
              borderLeftColor: theme('colors.brand.500'),
            },
            code: { color: theme('colors.brand.300') },
          },
        },
      }),
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-in': 'slideIn 0.5s ease forwards',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}

export default config