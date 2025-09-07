/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        // Authentic Marketplace Color Palette (inspired by OLX, eBay, Mercari)
        marketplace: {
          // Primary brand colors
          primary: "#002f34", // OLX dark teal
          "primary-light": "#23e5db", // OLX bright teal
          "primary-hover": "#1a4c50", // Darker teal on hover

          // Secondary colors
          secondary: "#ffce32", // OLX yellow/warning
          "secondary-dark": "#e6b800",

          // Grays (marketplace standard)
          "gray-50": "#fafafa",
          "gray-100": "#f5f5f5",
          "gray-200": "#eeeeee",
          "gray-300": "#e0e0e0",
          "gray-400": "#bdbdbd",
          "gray-500": "#9e9e9e",
          "gray-600": "#757575",
          "gray-700": "#616161",
          "gray-800": "#424242",
          "gray-900": "#212121",

          // Status colors
          success: "#4caf50", // Green for sold/success
          "success-light": "#c8e6c9",
          error: "#f44336", // Red for errors
          "error-light": "#ffcdd2",
          warning: "#ff9800", // Orange for warnings
          "warning-light": "#ffe0b2",

          // Background colors
          "bg-primary": "#ffffff",
          "bg-secondary": "#f8f9fa",
          "bg-accent": "#f0f8ff",

          // Border colors
          "border-light": "#e1e4e8",
          "border-medium": "#d1d5da",
          "border-dark": "#959da5",

          // Text colors
          "text-primary": "#1a1a1a",
          "text-secondary": "#586069",
          "text-muted": "#8b8b8b",
          "text-link": "#0366d6",
          "text-link-hover": "#0256cc",
        },

        // Category colors (like real marketplaces)
        category: {
          cars: "#ff6b35", // Orange
          electronics: "#4285f4", // Blue
          fashion: "#ea4c89", // Pink
          home: "#34a853", // Green
          sports: "#fbbc04", // Yellow
          books: "#9c27b0", // Purple
          default: "#6c757d", // Gray
        },

        // Price/monetary colors
        price: {
          regular: "#1a1a1a",
          discount: "#e53e3e",
          "was-price": "#8b8b8b",
          currency: "#2d3748",
        },
      },
      boxShadow: {
        marketplace: "0 2px 8px rgba(0, 0, 0, 0.1)",
        "marketplace-hover": "0 4px 16px rgba(0, 0, 0, 0.15)",
        "marketplace-card":
          "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
        "marketplace-elevated":
          "0 4px 8px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08)",
      },
      borderRadius: {
        marketplace: "8px",
        "marketplace-lg": "12px",
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
