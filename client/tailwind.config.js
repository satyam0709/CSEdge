/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'big': ['48px', '56px'],
        'small': ['28px', '34px'],
        'default': ['15px', '21px'],
      },
      colors: {
        primary: {
          DEFAULT: '#ff0000', // Red
          dark: '#b30000',
        },
        dark: {
          DEFAULT: '#111111', // Black
          light: '#222222',
        },
      },
      gridTemplateColumns: {
        'auto' : 'repeat(auto-fit, minmax(200px, 1fr))',
      },
      spacing:{
        'section-height' : '400px',
      }
    },
  },
  plugins: [],
}
