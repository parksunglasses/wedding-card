/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['Pretendard', 'sans-serif'],
        script: ['"Great Vibes"', 'cursive'],
      },
      colors: {
        cream: '#F5F0E8',
        warm: '#EDE6D8',
        dark: '#2A2520',
        darker: '#1F1B17',
        accent: '#A68B5B',
        'accent-light': '#C4A574',
      },
    },
  },
  plugins: [],
}
