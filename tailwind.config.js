/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/contexts/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slateBrand: {
          900: "#0f172a",
          800: "#1e293b",
          700: "#334155",
        },
        mint: "#10b981",
      },
    },
  },
  plugins: [],
};

