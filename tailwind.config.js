/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F4F4F5",
        dark: "#111114",
        accent: "#0066FF",
        grey: "#4A4A4A",
      },
      fontFamily: {
        primary: ["Inter"],
        accent: ["Luxurious Script"],
        bebas: ["Bebas Neue"],
        anton: ["Anton"],
      },
    },
  },
  plugins: [],
};
