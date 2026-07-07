import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#2C1E47',
        violet: '#6A3EC9',
        rose: '#E94E8B',
        orange: '#FF8A00',
        gold: '#FFC107',
        canvas: '#F4F6FA',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #6A3EC9 0%, #E94E8B 55%, #FF8A00 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
