/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{html,js}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'rgb(50, 65, 127)',
          primaryDark: 'rgb(35, 45, 89)',
          primaryLight: 'rgb(65, 80, 144)',
        },
        gray: {
          custom: 'rgb(131, 125, 127)',
        }
      }
    }
  },
  plugins: [],
}
