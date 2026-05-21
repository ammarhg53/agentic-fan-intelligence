import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./charts/**/*.{ts,tsx}",
    "./animations/**/*.{ts,tsx}",
    "./ai/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./store/**/*.{ts,tsx}",
    "./utils/**/*.{ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1440px"
      }
    },
    extend: {
      colors: {
        pitch: {
          950: "#020408",
          900: "#050912",
          850: "#07101b",
          800: "#0b1728",
          700: "#112542",
          600: "#17345c"
        },
        neon: {
          DEFAULT: "#00e5ff",
          50: "#e0fbff",
          100: "#b3f5ff",
          200: "#80eeff",
          300: "#4de7ff",
          400: "#26e0ff",
          500: "#00e5ff",
          600: "#00b8cc",
          700: "#008a99"
        },
        violet: {
          DEFAULT: "#8b5cf6",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed"
        },
        lime: {
          DEFAULT: "#39ff14",
          400: "#6fff4a",
          500: "#39ff14",
          600: "#2dd40f"
        },
        gold: {
          DEFAULT: "#ffd166",
          400: "#ffe08f",
          500: "#ffd166",
          600: "#d9a62a"
        },
        crimson: {
          DEFAULT: "#ff3b6b",
          400: "#ff6f91",
          500: "#ff3b6b",
          600: "#d91f4f"
        },
        amber: {
          DEFAULT: "#ff9f1c",
          400: "#ffbd59",
          500: "#ff9f1c",
          600: "#d67e00"
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        }
      },
      fontFamily: {
        body: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        score: ["var(--font-score)", "ui-monospace", "SFMono-Regular", "monospace"]
      },
      borderRadius: {
        lg: "8px",
        md: "6px",
        sm: "4px"
      },
      boxShadow: {
        glass: "0 14px 48px rgba(0, 0, 0, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
        "glass-hover": "0 22px 70px rgba(0, 229, 255, 0.14)",
        "neon-sm": "0 0 12px rgba(0, 229, 255, 0.35)",
        "violet-sm": "0 0 16px rgba(139, 92, 246, 0.35)",
        "lime-sm": "0 0 14px rgba(57, 255, 20, 0.32)"
      },
      backgroundImage: {
        "pitch-grid":
          "linear-gradient(180deg, rgba(2, 4, 8, 0.3) 0%, rgba(2, 4, 8, 0.95) 100%), linear-gradient(rgba(0, 229, 255, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.05) 1px, transparent 1px)",
        "panel-sheen":
          "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 42%, rgba(0, 229, 255, 0.08) 100%)",
        "neon-line": "linear-gradient(90deg, transparent 0%, #00e5ff 45%, #8b5cf6 55%, transparent 100%)"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "scan-line": {
          "0%": { transform: "translateY(-12%)", opacity: "0" },
          "18%": { opacity: "0.55" },
          "100%": { transform: "translateY(110vh)", opacity: "0" }
        },
        "meter-flow": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "160% 50%" }
        }
      },
      animation: {
        "fade-up": "fade-up 480ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "scan-line": "scan-line 7s linear infinite",
        "meter-flow": "meter-flow 3.8s linear infinite"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
