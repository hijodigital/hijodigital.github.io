/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    fontFamily: {
      'sans': ['"Work Sans"', 'sans-serif'],
      'heading': ['"Fat Frank"', 'sans-serif'],
    },
    extend: {
      height: {
        screen: ['100vh', '100dvh']
      }
    },
  },
  plugins: [],
}
