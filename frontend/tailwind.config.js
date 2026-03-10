/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fbf6ed",
          100: "#f5e8cb",
          200: "#ecd3a3",
          300: "#d59b45",
          400: "#b4742c",
          500: "#7a5433",
          600: "#60432d",
          700: "#4a3526",
          800: "#3b2a1e",
          900: "#2e2017"
        },
        accent: {
          50: "#eef6f1",
          100: "#d7eadf",
          200: "#afd6bf",
          300: "#82ba98",
          400: "#5e9a76",
          500: "#437d5d",
          600: "#33644a",
          700: "#294f3b",
          800: "#223f30",
          900: "#1d3428"
        },
        signal: {
          50: "#fff7e5",
          100: "#fdecc0",
          200: "#f8d988",
          300: "#f2bf43",
          400: "#d9a31f",
          500: "#b98716",
          600: "#946a13",
          700: "#745312",
          800: "#5f4415",
          900: "#513a16"
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

