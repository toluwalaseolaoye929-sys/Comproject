/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        richBlack: '#1A1110',   // warm dark background
        cream: '#FFF8F0',       // soft off‑white for text
        rose: '#C44569',        // pink accent (buttons, highlights)
        gold: '#D4A373',        // secondary accent
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        cursive: ['"Great Vibes"', 'cursive'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};