/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        bubblegum: ['"Bubblegum Sans"', 'cursive'],
      },
      keyframes: {
        'rainbow-border': {
          '0%, 100%': {
            'border': '4px solid #ff0000',
            'box-shadow': '0 0 20px #ff0000',
          },
          '20%': {
            'border': '4px solid #ff8800',
            'box-shadow': '0 0 20px #ff8800',
          },
          '40%': {
            'border': '4px solid #ffff00',
            'box-shadow': '0 0 20px #ffff00',
          },
          '60%': {
            'border': '4px solid #00ff00',
            'box-shadow': '0 0 20px #00ff00',
          },
          '80%': {
            'border': '4px solid #0000ff',
            'box-shadow': '0 0 20px #0000ff',
          }
        }
      },
      animation: {
        'rainbow-border': 'rainbow-border 5s linear infinite',
      }
    },
  },
  plugins: [],
};
