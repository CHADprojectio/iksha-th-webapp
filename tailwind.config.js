/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        button: "var(--button)",
        h1: "var(--h1)",
        p: "var(--h1)"
      }
    },
  },
  plugins: [],
}