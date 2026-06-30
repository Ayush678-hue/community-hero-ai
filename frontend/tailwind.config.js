/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-serif)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      colors: {
        editorial: {
          bg: '#f7f6f0',        // Warm off-white/cream background
          dark: '#1c1d1f',      // Soft charcoal black
          card: 'rgba(255, 255, 255, 0.82)', // Soft light glass
          border: 'rgba(28, 29, 31, 0.08)',  // Grayscale border
          accent: '#0052cc',    // Elegant blue/cyan AI highlight
          alert: '#cc3300',     // Muted red/amber emergency alert
          success: '#1b8753',   // Muted emerald resolution green
          grayLight: '#eae9e0'  // Slightly darker cream for contrast
        }
      },
      boxShadow: {
        editorial: '0 20px 40px -15px rgba(28, 29, 31, 0.05)',
        'glow-accent': '0 0 15px rgba(0, 82, 204, 0.15)',
        'glow-success': '0 0 15px rgba(27, 135, 83, 0.15)',
      }
    },
  },
  plugins: [],
}
