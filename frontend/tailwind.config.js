/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class', // Support light/dark mode via class
  theme: {
    extend: {
      colors: {
        background: '#f9fafb', // Very Light Gray
        primary: '#3b82f6', // Blue
        secondary: '#ffffff', // White
        accent: '#10b981', // Emerald
        success: '#22c55e', // Green
        warning: '#f59e0b', // Amber
        danger: '#ef4444', // Red
      },
      boxShadow: {
        'clay': '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
        'clay-dark': '8px 8px 16px #1a1c23, -8px -8px 16px #2a2d39',
        'clay-inset': 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      }
    },
  },
  plugins: [],
}
