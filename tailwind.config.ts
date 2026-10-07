import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#06130f',
        forest: '#0a2f25',
        emerald: '#0f6b4f',
        lime: '#d9f64a',
        sun: '#f7c948',
        cream: '#f4f0e6',
        paper: '#fffdf7',
        sky: '#58b8d9',
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-barlow-condensed)', 'Arial Narrow', 'sans-serif'],
      },
      boxShadow: {
        'lime': '0 0 0 1px rgba(217, 246, 74, 0.35), 0 18px 50px rgba(217, 246, 74, 0.16)',
        'card': '0 24px 70px rgba(6, 19, 15, 0.12)',
      },
      backgroundImage: {
        'hero-grid': 'linear-gradient(rgba(217,246,74,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(217,246,74,.06) 1px, transparent 1px)',
      },
      animation: {
        'soft-pulse': 'soft-pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'quiz-enter': 'quiz-enter 500ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'quiz-pop': 'quiz-pop 450ms cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'progress-shine': 'progress-shine 1.8s ease-in-out infinite',
      },
      keyframes: {
        'soft-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(217, 246, 74, 0)' },
          '50%': { boxShadow: '0 0 0 10px rgba(217, 246, 74, 0.08)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'quiz-enter': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'quiz-pop': {
          '0%': { opacity: '0', transform: 'scale(0.72) rotate(-8deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0)' },
        },
        'progress-shine': {
          '0%': { transform: 'translateX(-160%)' },
          '100%': { transform: 'translateX(360%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
