/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      grotesk: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      poppins: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      sans: ['ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    extend: {
      colors: {
        background: 'rgb(var(--color-background))',
        foreground: 'rgb(var(--color-foreground))',
        primary: 'rgb(var(--color-primary))',
        secondary: 'rgb(var(--color-secondary))',
        lemon: 'rgb(var(--color-lemon))',
        green: 'rgb(var(--color-green))',
        card: 'rgb(var(--color-card))',
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
      },
      screens: {
        'xs': '475px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}