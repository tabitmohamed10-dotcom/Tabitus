import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Syne', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          light: 'hsl(var(--primary-light))',
          dark: 'hsl(var(--primary-dark))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        surface: {
          1: 'hsl(var(--card))',
          2: 'hsl(var(--secondary))',
          3: 'hsl(var(--muted))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      spacing: {
        '4.5': '1.125rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
        '22': '5.5rem',
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        '10': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-up': 'fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-down': 'fade-down 0.3s ease-out',
        'scale-in': 'scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slide-in-right 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'float': 'float 4s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'shimmer': 'shimmer 1.8s infinite',
        'glow': 'glow-pulse 2.5s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 1.5s ease-out infinite',
        'marquee': 'marquee 30s linear infinite',
        'spin-slow': 'spin-slow 12s linear infinite',
        'gradient': 'gradient-shift 4s ease infinite',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-down': {
          from: { opacity: '0', transform: 'translateY(-16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.94)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(0.5deg)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(234,88,12,0.25)' },
          '50%': { boxShadow: '0 0 40px rgba(234,88,12,0.45), 0 0 80px rgba(234,88,12,0.15)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #f97316 0%, #ea580c 60%, #c2410c 100%)',
        'brand-gradient-subtle': 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)',
        'brand-gradient-warm': 'linear-gradient(135deg, #fef3c7 0%, #fff7ed 50%, #fce7f3 100%)',
        'dark-gradient': 'linear-gradient(135deg, #1c1410 0%, #2d1f14 100%)',
        'mesh-gradient': 'radial-gradient(at 40% 20%, hsla(22,95%,70%,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(38,95%,60%,0.10) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,85%,65%,0.08) 0px, transparent 50%)',
      },
      boxShadow: {
        'xs': '0 1px 2px rgba(0,0,0,0.04)',
        'premium': '0 1px 3px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)',
        'elevated': '0 4px 16px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
        'floating': '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
        'dramatic': '0 16px 56px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)',
        'brand': '0 8px 32px rgba(234,88,12,0.20), 0 2px 8px rgba(234,88,12,0.12)',
        'brand-lg': '0 16px 48px rgba(234,88,12,0.28), 0 4px 16px rgba(234,88,12,0.16)',
        'premium-hover': '0 4px 16px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.06)',
        'inner-brand': 'inset 0 1px 0 rgba(255,255,255,0.12)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
