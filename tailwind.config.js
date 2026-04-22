/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6C5CE7',
          hover: '#5A4BD1',
          light: '#EDE9FF',
        },
        cream: '#F5F3EF',
        limbo: {
          muted: '#F1EEE9',
          border: '#E5E5E5',
          text: '#6B6B6B',
          danger: '#FF6B6B',
          warning: '#F59E0B',
          success: '#22C55E',
        },
      },
      fontFamily: {
        sans: ['InterVariable', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
        pill: '9999px',
      },
      boxShadow: {
        card: '0 2px 16px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 32px rgba(108,92,231,0.12), 0 2px 8px rgba(0,0,0,0.06)',
        primary: '0 6px 16px rgba(108,92,231,0.28)',
        'primary-hover': '0 8px 20px rgba(108,92,231,0.38)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.2, 0, 0, 1)',
      },
    },
  },
  plugins: [],
}
