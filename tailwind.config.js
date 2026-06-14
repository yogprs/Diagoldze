/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app.vue",
    "./app/**/*.{vue,js,ts,jsx,tsx}",
    "./components/**/*.{vue,js,ts}",
    "./pages/**/*.{vue,js,ts}",
    "./layouts/**/*.{vue,js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0f",
        "on-background": "#e5e1e4",

        surface: "#131315",
        "surface-dim": "#131315",
        "surface-bright": "#39393b",

        "surface-container-lowest": "#0e0e10",
        "surface-container-low": "#1b1b1d",
        "surface-container": "#201f21",
        "surface-container-high": "#2a2a2c",
        "surface-container-highest": "#353437",

        "surface-variant": "#353437",
        "surface-tint": "#c8bfff",

        "on-surface": "#e5e1e4",
        "on-surface-variant": "#c9c4d5",

        "inverse-surface": "#e5e1e4",
        "inverse-on-surface": "#303032",

        outline: "#928f9e",
        "outline-variant": "#474553",

        primary: {
          DEFAULT: "#c8bfff",
          foreground: "#2d128f",
          container: "#6a5acd",
          "container-foreground": "#f0ebff",
          inverse: "#5d4cbf",
          fixed: "#e5deff",
          "fixed-dim": "#c8bfff",
          "fixed-foreground": "#190064",
          "fixed-variant": "#4532a6",
        },

        secondary: {
          DEFAULT: "#c9beff",
          foreground: "#311c7e",
          container: "#4a3998",
          "container-foreground": "#bbaeff",
          fixed: "#e6deff",
          "fixed-dim": "#c9beff",
          "fixed-foreground": "#1b0062",
          "fixed-variant": "#483795",
        },

        tertiary: {
          DEFAULT: "#ffafd7",
          foreground: "#620044",
          container: "#b53c87",
          "container-foreground": "#ffe8f0",
          fixed: "#ffd8e9",
          "fixed-dim": "#ffafd7",
          "fixed-foreground": "#3c0029",
          "fixed-variant": "#860f60",
        },

        error: {
          DEFAULT: "#ffb4ab",
          foreground: "#690005",
          container: "#93000a",
          "container-foreground": "#ffdad6",
        },
      },
    },
  },
  plugins: [],
};
