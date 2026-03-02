/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f4f7f2",
          100: "#e6edde",
          200: "#cad9ba",
          300: "#a9c28f",
          400: "#84a764",
          500: "#698a48",
          600: "#526d38",
          700: "#3f532d",
          800: "#334225",
          900: "#2b371f"
        }
      },
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
        display: ["Fraunces", "serif"]
      }
    }
  },
  plugins: []
};

