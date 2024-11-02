/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bolt: {
          dark: {
            bg: '#0A0A0A',
            surface: '#141414',
            border: '#262626',
            hover: '#1F1F1F',
            text: {
              primary: '#FFFFFF',
              secondary: '#A3A3A3',
              tertiary: '#666666'
            }
          }
        }
      }
    },
  },
  plugins: [],
};