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
      keyframes: {
        // uses CSS variables for direction & zoom so you can control it per-card
        kenburns: {
          "0%": {
            transform:
              "translate(var(--kb-x-start, 0), var(--kb-y-start, 0)) scale(var(--kb-scale-start, 1))",
          },
          "100%": {
            transform:
              "translate(var(--kb-x-end, 0), var(--kb-y-end, 0)) scale(var(--kb-scale-end, 1.15))",
          },
        },
      },
      animation: {
        kenburns: "kenburns 12s ease-in-out forwards",
      },
    },
  },
  plugins: [],
};
