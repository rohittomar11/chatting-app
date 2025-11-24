/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        whatsapp: {
          green: "#22c55e",
          darkGreen: "#16a34a",
          bg: "#020617",
          bubbleMe: "#22c55e",
          bubbleOther: "#111827",
        },
      },
    },
  },
  plugins: [],
};
