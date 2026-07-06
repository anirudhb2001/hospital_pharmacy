/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        background: '#f0f2f5',
        primary: '#3b82f6',
        accent: '#10b981',
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      boxShadow: {
        clay: '6px 6px 12px #d1d9e6, -4px -4px 10px #ffffff',
        'clay-sm': '3px 3px 6px #d1d9e6, -2px -2px 5px #ffffff',
        'clay-lg': '10px 10px 20px #c8d0dd, -6px -6px 14px #ffffff',
        'clay-inset': 'inset 3px 3px 6px #d1d9e6, inset -2px -2px 5px #ffffff',
        'clay-hover': '8px 12px 20px #c8d0dd, -4px -4px 12px #ffffff',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
