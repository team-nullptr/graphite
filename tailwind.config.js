/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      debug: "#FF1493",
      white: "#ffffff",
      black: "#000000",
      "base-200": "#f5f5f5",
      "base-300": "#e5e5e5",
      "diagnostic-error": "#fb8500",
      "diagnostic-ok": "#a7c957",
    },
    extend: {},
  },
  plugins: [],
};
