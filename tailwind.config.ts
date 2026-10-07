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
        ink: '#232324',
        forest: '#287646',
        emerald: '#287646',
        lime: '#f5ad3e',
        sun: '#f5ad3e',
        cream: '#fffdee',
        paper: '#fffdee',
        sky: '#112b99',
        campaignRed: '#d61600',
        campaignBlue: '#112b99',
      },
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Oferta do Dia"', 'Arial Narrow', 'sans-serif'],
      },
      boxShadow: {
        'lime': '7px 7px 0 #232324',
        'card': '10px 10px 0 rgba(35, 35, 36, 0.9)',
      },
      backgroundImage: {
        'hero-grid': 'url("/brand/textura-grunge.webp")',
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
          '0%, 100%': { boxShadow: '7px 7px 0 #232324' },
          '50%': { boxShadow: '11px 11px 0 #232324' },
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
