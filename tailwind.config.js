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
        
        border: "var(--border)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },

      fontFamily: {
        "inter": ["Inter", "sans-serif"],
        "space-grotesk": ["Space Grotesk", "sans-serif"],
        "bebas-neue": ["Bebas Neue", "sans-serif"],
        
        // Default sans font stack
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        
        // Legacy CSS variable support
        "body-body-4-400": "var(--body-body-4-400-font-family)",
        "body-body1-300": "var(--body-body1-300-font-family)",
        "body-body1-500": "var(--body-body1-500-font-family)",
        "body-body1-mob-300": "var(--body-body1-mob-300-font-family)",
        "body-body2-400": "var(--body-body2-400-font-family)",
        "body-body3-400": "var(--body-body3-400-font-family)",
        "body-body3-500": "var(--body-body3-500-font-family)",
        "body-body3-mob-400": "var(--body-body3-mob-400-font-family)",
        "body-labeltext-400": "var(--body-labeltext-400-font-family)",
        "titles-h2-sectionheading-400": "var(--titles-h2-sectionheading-400-font-family)",
        "titles-h3-caption-400": "var(--titles-h3-caption-400-font-family)",
        "titles-h5-large-text-400": "var(--titles-h5-large-text-400-font-family)",
      
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
    container: { 
      center: true, 
      padding: "2rem", 
      screens: { "2xl": "1400px" } 
    },
  },
  plugins: [],
  darkMode: ["class"],
};