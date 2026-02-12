// constants/Colors.ts

// 1. RAW PALETTE (DO NOT USE DIRECTLY IN COMPONENTS)
const palette = {
  // Base
  white: "#FFFFFF",
  black: "#000000",

  // Brand Reds (Foodhub style)
  brandRed: "#E2211C",
  brandRedDark: "#C81D18",
  brandRedLight: "#FCE8E7",

  // Neutrals
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray300: "#D1D5DB",
  gray600: "#4B5563",
  gray800: "#1F2937",
  gray900: "#111827",

  // Status
  success: "#16A34A",
  warning: "#F59E0B",
  error: "#DC2626",
};

// 2. SEMANTIC TOKENS (USE THESE IN COMPONENTS)
export const Colors = {
  light: {
    // Layout
    background: palette.white,
    surface: palette.gray50,
    elevated: palette.white,

    // Brand
    primary: palette.brandRed,
    primaryHover: palette.brandRedDark,
    primarySoft: palette.brandRedLight,

    // Text
    textPrimary: palette.gray900,
    textSecondary: palette.gray600,
    textInverse: palette.white,

    // UI
    border: palette.gray200,
    divider: palette.gray100,
    iconDefault: palette.gray600,
    iconActive: palette.brandRed,

    // Buttons
    buttonPrimaryBackground: palette.brandRed,
    buttonPrimaryText: palette.white,
    buttonSecondaryBackground: palette.gray100,
    buttonSecondaryText: palette.gray900,

    // Status
    success: palette.success,
    warning: palette.warning,
    danger: palette.error,
  },

  dark: {
    // Layout
    background: "#0F0F0F",
    surface: "#1A1A1A",
    elevated: "#242424",

    // Brand
    primary: palette.brandRed,
    primaryHover: palette.brandRedDark,
    primarySoft: "#3A0D0C",

    // Text
    textPrimary: palette.white,
    textSecondary: palette.gray300,
    textInverse: palette.black,

    // UI
    border: "#2C2C2C",
    divider: "#1F1F1F",
    iconDefault: palette.gray300,
    iconActive: palette.brandRed,

    // Buttons
    buttonPrimaryBackground: palette.brandRed,
    buttonPrimaryText: palette.white,
    buttonSecondaryBackground: "#2A2A2A",
    buttonSecondaryText: palette.white,

    // Status
    success: palette.success,
    warning: palette.warning,
    danger: palette.error,
  },
};
