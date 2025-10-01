/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Patrick Hand"', 'cursive'],
      },
      colors: {
        'primary': '#2d6a4f',
        'secondary': '#40916c',
        'accent': '#fca311',
        'background-light': '#fdfcdc',
        'background-dark': '#1d3557',
        'text-light': '#1d3557',
        'text-dark': '#fdfcdc',
      },
    },
  },
  plugins: [],
}