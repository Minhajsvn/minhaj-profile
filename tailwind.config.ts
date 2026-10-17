import type { Config } from "tailwindcss";

// Colors are stored as RGB channels in globals.css so opacity modifiers (e.g. bg-surface/60) work.
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        background: token("background"),
        surface: token("surface"),
        border: token("border"),
        foreground: token("foreground"),
        muted: token("muted"),
        primary: {
          DEFAULT: token("primary"),
          foreground: token("primary-foreground"),
          hover: token("primary-hover"),
        },
        accent: token("accent"),
        tag: {
          DEFAULT: token("tag-bg"),
          foreground: token("tag-fg"),
        },
        pine: "#0F4A3A",
        sage: "#8FA89A",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        panel: "clamp(1.75rem, 4vw, 3rem)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
