/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        azul: "#2563EB",
        laranja: "#F97316",
        verde: "#16A34A",
        amarelo: "#EAB308",
        branco: "#FFFFFF"
      }
    }
  },
  plugins: [],
}
