/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wedding: {
          red: '#DC2626',
          gold: '#F59E0B',
          cream: '#FFFBEB',
          dark: '#1E293B'
        }
      }
    },
  },
  plugins: [],
}
