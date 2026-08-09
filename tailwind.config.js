/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        nailpink: "#FF2B6E",
        nailpinkHover: "#E62662",
        naildark: "#0F0F0F",
        nailmuted: "#8A8A8A",
        nailbg: "#FDF8F6",
        nailyellow: "#FFD600",
        nailblue: "#7DD3E0",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Inter", "sans-serif"],
      }
    }
  },
  plugins: []
}
