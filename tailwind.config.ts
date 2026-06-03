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
        sans:      ['var(--font-geist-sans)', 'Inter', 'system-ui', 'sans-serif'],
        mono:      ['var(--font-geist-mono)', 'Menlo', 'monospace'],
        cinzel:    ['var(--font-cinzel)', 'Cinzel', 'serif'],
        cormorant: ['var(--font-cormorant)', 'Cormorant Garamond', 'serif'],
      },
      colors: {
        border:     'hsl(var(--border))',
        input:      'hsl(var(--input))',
        ring:       'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          light:      'hsl(var(--primary-light))',
          dark:       'hsl(var(--primary-dark))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        gold: {
          50:  '#fdf8ec',
          100: '#f9edcc',
          200: '#f0d080',
          300: '#e8b84b',
          400: '#d4a230',
          500: '#c9922a',
          600: '#b8791a',
          700: '#9a6c1a',
          800: '#7a4c08',
          900: '#3d2504',
        },
        noir: {
          DEFAULT: '#0a0a0f',
          soft:    '#12121a',
          muted:   '#1e1e2a',
        },
        surface: {
          1: 'hsl(var(--card))',
          2: 'hsl(var(--secondary))',
          3: 'hsl(var(--muted))',
        },
      },
      borderRadius: {
        lg:   'var(--radius)',
        md:   'calc(var(--radius) - 2px)',
        sm:   'calc(var(--radius) - 4px)',
        xl:   '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      spacing: {
        '4.5': '1.125rem',
        '13':  '3.25rem',
        '15':  '3.75rem',
        '18':  '4.5rem',
        '22':  '5.5rem',
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        '10':  ['0.625rem', { lineHeight: '0.875rem' }],
      },
      animation: {
        'fade-in':        'fade-in 0.3s ease-out',
        'fade-up':        'fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-down':      'fade-down 0.3s ease-out',
        'scale-in':       'scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up':       'slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slide-in-right 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'float':          'float 4s ease-in-out infinite',
        'float-slow':     'float-slow 6s ease-in-out infinite',
        'shimmer':        'shimmer 1.8s infinite',
        'glow':           'glow-pulse 2.5s ease-in-out infinite',
        'pulse-ring':     'pulse-ring 1.5s ease-out infinite',
        'marquee':        'marquee 30s linear infinite',
        'spin-slow':      'spin-slow 12s linear infinite',
        'gradient':       'gradient-shift 4s ease infinite',
        'bounce-subtle':  'bounce-subtle 2s ease-in-out infinite',
        'beam':           'beam 2.5s infinite',
      },
      keyframes: {
        'fade-in':  { from: { opacity: '0' }, to: { opacity: '1' } },
        'fade-up':  {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-down': {
          from: { opacity: '0', transform: 'translateY(-16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.94)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to:   { transform: 'translateX(0)',    opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%':      { transform: 'translateY(-10px) rotate(0.5deg)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(201,146,42,0.25)' },
          '50%':      { boxShadow: '0 0 40px rgba(201,146,42,0.45), 0 0 80px rgba(201,146,42,0.15)' },
        },
        'pulse-ring': {
          '0%':   { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        'marquee': {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-4px)' },
        },
        'beam': {
          '0%':   { transform: 'translateX(-100%) skewX(-12deg)' },
          '100%': { transform: 'translateX(300%) skewX(-12deg)' },
        },
      },
      backgroundImage: {
        'gold-gradient':        'linear-gradient(135deg, #e8b84b 0%, #d4a230 50%, #c9922a 100%)',
        'gold-gradient-subtle': 'linear-gradient(135deg, rgba(201,146,42,0.12) 0%, rgba(184,121,26,0.08) 100%)',
        'gold-gradient-dark':   'linear-gradient(135deg, rgba(201,146,42,0.15) 0%, rgba(154,108,26,0.08) 100%)',
        'mesh-gradient':        'radial-gradient(at 40% 20%, hsla(42,78%,56%,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(39,66%,48%,0.10) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(36,64%,42%,0.08) 0px, transparent 50%)',
        'dark-gradient':        'linear-gradient(135deg, #0a0a0f 0%, #12121a 100%)',
      },
      boxShadow: {
        'xs':            '0 1px 2px rgba(0,0,0,0.04)',
        'premium':       '0 1px 3px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)',
        'elevated':      '0 4px 16px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
        'floating':      '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
        'dramatic':      '0 16px 56px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)',
        'brand':         '0 8px 32px rgba(201,146,42,0.20), 0 2px 8px rgba(201,146,42,0.12)',
        'brand-lg':      '0 16px 48px rgba(201,146,42,0.28), 0 4px 16px rgba(201,146,42,0.16)',
        'premium-hover': '0 4px 16px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.06)',
        'inner-brand':   'inset 0 1px 0 rgba(255,255,255,0.12)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
