import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}','./components/**/*.{js,ts,jsx,tsx,mdx}','./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        gold: { 50:'#FDF8EC',100:'#F5E6C8',200:'#F0D080',300:'#D4B483',400:'#BFA06A',500:'#C9922A',600:'#B8791A',700:'#8B6914',800:'#6B4F0F',900:'#3D2504' },
        noir: { DEFAULT:'#0C0B09', soft:'#171612', muted:'#1C1B16', border:'#2A2820' },
        cream: { DEFAULT:'#FAFAF7', dim:'#F5F2EA', border:'#E8E0CC' },
        stone: { muted:'#8A856E', light:'#C4BCA8' },
      },
      fontFamily: {
        playfair: ['var(--font-playfair)','Georgia','serif'],
        inter:    ['var(--font-inter)','system-ui','sans-serif'],
        arabic:   ['var(--font-arabic)','serif'],
      },
    },
  },
  plugins: [],
}
export default config
