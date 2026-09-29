/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          50:  "#f0f7f0",
          100: "#d9edda",
          200: "#b3dbb6",
          300: "#7dc182",
          400: "#4da155",
          500: "#2e7d32",  // primary green
          600: "#256427",
          700: "#1a4d1c",
          800: "#123514",
          900: "#0a1e0b",
        },
        sage: {
          50:  "#f4f7f2",
          100: "#e6ede2",
          200: "#cddcc6",
          300: "#a8c49e",
          400: "#7ea872",
          500: "#5d8f51",
          600: "#48703e",
          700: "#385733",
          800: "#2d4429",
          900: "#1d2e1b",
        },
        cream: {
          50:  "#fffef7",
          100: "#fefce8",
          200: "#fef9c3",
          300: "#fef08a",
          400: "#fde047",
        },
        bark: {
          100: "#f5f0e8",
          200: "#ece3d4",
          300: "#d4c4a8",
          400: "#b8a07c",
        },
      },
      fontFamily: {
        display: ['"DM Serif Display"', "Georgia", "serif"],
        body:    ['"DM Sans"', "system-ui", "sans-serif"],
        mono:    ['"JetBrains Mono"', "monospace"],
      },
      boxShadow: {
        card:    "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
        lift:    "0 4px 16px -2px rgb(0 0 0 / 0.10), 0 2px 8px -2px rgb(0 0 0 / 0.06)",
        glow:    "0 0 0 3px rgb(46 125 50 / 0.20)",
        danger:  "0 0 0 3px rgb(220 38 38 / 0.20)",
      },
      borderRadius: {
        xl2: "1rem",
        xl3: "1.5rem",
      },
      animation: {
        "fade-in":   "fadeIn 0.4s ease-out both",
        "slide-up":  "slideUp 0.35s ease-out both",
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn:   { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp:  { from: { opacity: "0", transform: "translateY(12px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        pulseDot: { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.4" } },
      },
    },
  },
  plugins: [],
};
