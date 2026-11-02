/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        crema: "#FAFAF7",
        tinta: {
          DEFAULT: "#1A1D24",
          suave: "#5B616E",
          apagado: "#9AA1AD",
        },
        terracota: {
          DEFAULT: "#E85D2F",
          oscuro: "#D14E23",
          suave: "#FDEDE6",
        },
        borde: "#E8E6E0",
        exito: "#15803D",
      },
      boxShadow: {
        suave: "0 8px 30px rgba(26, 29, 36, 0.08)",
      },
    },
  },
  plugins: [],
};
