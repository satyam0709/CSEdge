// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  content:[
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
      gridTemplateColumns: {
        'auto' : 'repeat(auto-fit, minmax(200px, 1fr))',
      },
    },
  },

  plugins: [
    react(),
    tailwindcss(),
  ],
})
