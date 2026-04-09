/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#080812',
        bg2: '#0f1120',
        bg3: '#141628',
        accent: '#6366f1',
        accent2: '#22d3ee',
        success: '#4ade80',
      },
      fontFamily: {
        sans: ['Inter', 'DM Sans', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', 'Tajawal', 'sans-serif'],
      },
      animation: {
        shimmer: 'shimmer 1.4s infinite',
        pulse: 'pulse 1.5s ease-in-out infinite',
        spin: 'spin 0.7s linear infinite',
      },
    },
  },
  plugins: [],
};
