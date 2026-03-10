/** @type {import('tailwindcss').Config} */
export default {
  // Tell Tailwind which files to scan for class names
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Minimalist color palette — muted, professional tones
      colors: {
        surface: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
        },
        charcoal: {
          DEFAULT: '#27272a',
          light: '#3f3f46',
          muted: '#71717a',
        },
      },
      // Clean sans-serif font
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
