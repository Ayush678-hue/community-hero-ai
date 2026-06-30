
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
          bg: '#f7f6f0',        
          dark: '#1c1d1f',      
          card: 'rgba(255, 255, 255, 0.82)', 
          border: 'rgba(28, 29, 31, 0.08)',  
          accent: '#0052cc',    
          alert: '#cc3300',     
          success: '#1b8753',   
          grayLight: '#eae9e0'  
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
