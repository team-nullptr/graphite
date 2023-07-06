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
      "base-200": "#ffffff",
      "base-hover-200": "#fafafa",
      "base-300": "#f1f1f1",
      "text-base": "#222222",
      "text-dimmed": "#808080",

      // Dark
      "base-200-dark": "#323337",
      "base-300-dark": "#1E1F23",
      "text-base-dark": "#FCFBFF",
      "text-dimmed-dark": "#A0A0A0",

      // Editor
      "diagnostic-error": "#fb8500",
      "diagnostic-ok": "#a7c957",
    },
    extend: {},
  },
  plugins: [],
};
