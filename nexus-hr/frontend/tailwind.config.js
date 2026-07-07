/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc',
          400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca',
          800: '#3730a3', 900: '#312e81',
        },
        accent: { cyan: '#22d3ee', purple: '#a78bfa' },
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
};
