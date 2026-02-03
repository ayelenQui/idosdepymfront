/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        osd: {
          primary: "#125b58",
          secondary: "#8a4b40",
          bg: "#dfe7e4",
          slate: "#829ea1",
          sand: "#c9b69c",
          rose: "#b58b85",
          caramel: "#b17f5f",
          ice: "#a9c6c6",
        },
      },
      boxShadow: {
        soft: "0 10px 30px rgba(18, 91, 88, 0.12)",
      },
      borderRadius: {
        xl: "18px",
        "2xl": "22px",
      },
    },
  },
  plugins: [],
};
