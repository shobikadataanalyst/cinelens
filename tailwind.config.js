
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cinema: {
          bg: '#0a0b0f',
          card: '#10121a',
          accent: '#b88cff',
          text: '#e8e8f2'
        }
      }
    }
  },
  plugins: []
};
