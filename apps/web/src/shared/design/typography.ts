// src/shared/design/typography.ts
// Typography system with consistent font sizes and weights

export const typography = {
  fontFamily: {
    sans: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "sans-serif",
    ],
    mono: [
      "JetBrains Mono",
      "Fira Code",
      "Monaco",
      "Consolas",
      "Liberation Mono",
      "Courier New",
      "monospace",
    ],
  },

  fontSize: {
    xs: "0.75rem",    // 12px
    sm: "0.875rem",   // 14px
    base: "1rem",     // 16px
    lg: "1.125rem",   // 18px
    xl: "1.25rem",    // 20px
    "2xl": "1.5rem",  // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem",  // 36px
    "5xl": "3rem",    // 48px
    "6xl": "3.75rem", // 60px
  },

  fontWeight: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
  },

  lineHeight: {
    tight: "1.25",
    normal: "1.5",
    relaxed: "1.75",
  },

  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
} as const;

export const textStyles = {
  h1: "text-4xl font-bold tracking-tight lg:text-5xl",
  h2: "text-3xl font-semibold tracking-tight lg:text-4xl",
  h3: "text-2xl font-semibold tracking-tight",
  h4: "text-xl font-semibold tracking-tight",
  h5: "text-lg font-semibold tracking-tight",
  h6: "text-base font-semibold tracking-tight",
  p: "text-base leading-7",
  small: "text-sm font-medium leading-none",
  muted: "text-sm text-muted-foreground",
} as const;
