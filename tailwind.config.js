/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    colors: {
      // Util
      transparent: "transparent",
      debug: "#FF1493",
      white: "#ffffff",
      black: "#000000",

      // Light
      "base-200": "#f5f5f5",
      "base-300": "#e5e5e5",
      "text-base": "#000000",

      // Dark
      "base-200-dark": "#323337",
      "base-300-dark": "#1E1F23",
      "text-base-dark": "#FCFBFF",

      // Editor
      "diagnostic-error": "#fb8500",
      "diagnostic-ok": "#a7c957",
    },
    extend: {},
  },
  plugins: [],
};
