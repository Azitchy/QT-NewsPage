module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        mobile: "393px",
        tablet: "1024px",
        desktop: "1728px",
        large: "2560px",
      },
      colors: {
        "primary-colour": "var(--primary-colour)",
        stroke: "var(--stroke)",
        "white-colour": "var(--white-colour)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        "body-body-4-400": "var(--body-body-4-400-font-family)",
        "body-body1-300": "var(--body-body1-300-font-family)",
        "body-body1-500": "var(--body-body1-500-font-family)",
        "body-body1-mob-300": "var(--body-body1-mob-300-font-family)",
        "body-body2-400": "var(--body-body2-400-font-family)",
        "body-body3-400": "var(--body-body3-400-font-family)",
        "body-body3-500": "var(--body-body3-500-font-family)",
        "body-body3-mob-400": "var(--body-body3-mob-400-font-family)",
        "body-labeltext-400": "var(--body-labeltext-400-font-family)",
        "titles-h2-sectionheading-400":
          "var(--titles-h2-sectionheading-400-font-family)",
        "titles-h3-caption-400": "var(--titles-h3-caption-400-font-family)",
        "titles-h5-large-text-400":
          "var(--titles-h5-large-text-400-font-family)",
        sans: [
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      boxShadow: {
        "chat-shadow": "var(--chat-shadow)",
        "shadow-card": "var(--shadow-card)",
        "soft-shadow": "var(--soft-shadow)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
  },
  plugins: [],
  darkMode: ["class"],
};
