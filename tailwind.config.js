/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#f2efe8',
        ink: '#0e0d0b',
        primary: '#e8441e',
        'primary-dark': '#97290e',
        dim: '#6b6862',
        'dim-dark': '#c8c4bc',
        acid: '#c8f060'
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"DM Mono"', '"Courier New"', 'monospace']
      }
    }
  },
  plugins: []
}
