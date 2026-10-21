// src/shared/design/spacing.ts
// Consistent spacing system

export const spacing = {
  0: "0",
  1: "0.25rem",  // 4px
  2: "0.5rem",   // 8px
  3: "0.75rem",  // 12px
  4: "1rem",     // 16px
  5: "1.25rem",  // 20px
  6: "1.5rem",   // 24px
  8: "2rem",     // 32px
  10: "2.5rem",  // 40px
  12: "3rem",    // 48px
  16: "4rem",    // 64px
  20: "5rem",    // 80px
  24: "6rem",    // 96px
  32: "8rem",    // 128px
  40: "10rem",   // 160px
  48: "12rem",   // 192px
  56: "14rem",   // 224px
  64: "16rem",   // 256px,
} as const;

export const spacingClasses = {
  p: (value: keyof typeof spacing) => `p-${value}`,
  px: (value: keyof typeof spacing) => `px-${value}`,
  py: (value: keyof typeof spacing) => `py-${value}`,
  pt: (value: keyof typeof spacing) => `pt-${value}`,
  pr: (value: keyof typeof spacing) => `pr-${value}`,
  pb: (value: keyof typeof spacing) => `pb-${value}`,
  pl: (value: keyof typeof spacing) => `pl-${value}`,
  m: (value: keyof typeof spacing) => `m-${value}`,
  mx: (value: keyof typeof spacing) => `mx-${value}`,
  my: (value: keyof typeof spacing) => `my-${value}`,
  mt: (value: keyof typeof spacing) => `mt-${value}`,
  mr: (value: keyof typeof spacing) => `mr-${value}`,
  mb: (value: keyof typeof spacing) => `mb-${value}`,
  ml: (value: keyof typeof spacing) => `ml-${value}`,
  gap: (value: keyof typeof spacing) => `gap-${value}`,
} as const;
