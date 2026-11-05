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
      fontWeight: {
        normal: "400",
        medium: "500",
      },
      borderRadius: {
        sm: "6px",
      },
      colors: {
        // Fondo - crema premium
        crema: {
          DEFAULT: "#FFFEFB",
          oscuro: "#F6F3EB",
          suave: "#FDF8EE",
        },
        // Texto principal fintech
        tinta: {
          DEFAULT: "#0F172A",
          suave: "#64748B",
          apagado: "#94A3B8",
        },
        // BORDE premium
        borde: {
          DEFAULT: "#E2E8F0",
          suave: "#F1F5F9",
        },
        // AZUL - Botones principales fintech premium
        azul: {
          DEFAULT: "#1D4ED8",
          oscuro: "#1E3A8A",
          hover: "#1E40AF",
          claro: "#DBEAFE",
          "super-claro": "#EFF6FF",
          ink: "#172554",
        },
        // Compat: tu clase terracota ahora renderiza AZUL (no rompe nada)
        terracota: {
          DEFAULT: "#1D4ED8",
          oscuro: "#1E3A8A",
          suave: "#EFF6FF",
        },
        // Estados
        exito: {
          DEFAULT: "#047857",
          bg: "#ECFDF5",
        },
      },
      boxShadow: {
        suave: "0 8px 30px rgba(15, 23, 42, 0.06)",
        fintech: "0 1px 2px rgba(15,23,42,0.04), 0 4px 12px rgba(15,23,42,0.03)",
        "fintech-hover": "0 4px 12px rgba(15,23,42,0.06), 0 12px 24px rgba(15,23,42,0.04)",
        "boton-azul": "0 1px 2px rgba(29,78,216,0.1), 0 4px 12px rgba(29,78,216,0.15)",
      },
    },
  },
  plugins: [],
};
