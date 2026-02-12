// constants/Colors.ts

// ==========================
// 1️⃣ CORE PALETTE
// ==========================

const palette = {
  // Core CO (Red)
  CO: {
    100: "#FFD8D0",
    200: "#FBB1A3",
    300: "#F38A77",
    400: "#E7604E",
    500: "#D82927",
    600: "#B12722",
    700: "#8C241D",
    800: "#681F18",
    900: "#471913",
    1000: "#27110B",
  },

  // Core CM (Green)
  CM: {
    100: "#DFEFE2",
    200: "#BFDFC6",
    300: "#9FCFAA",
    400: "#7EBE8F",
    500: "#5BAE75",
    600: "#4D8F61",
    700: "#3E714D",
    800: "#30543B",
    900: "#233929",
    1000: "#161F18",
  },

  // Neutrals (derived from your system)
  neutral: {
    100: "#F5F5F5",
    200: "#E5E5E5",
    300: "#D4D4D4",
    400: "#A3A3A3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
    1000: "#0A0A0A",
  },

  white: "#FFFFFF",
};

// ==========================
// 2️⃣ SEMANTIC TOKENS
// ==========================

export const Colors = {
  light: {
    // Accent
    accentCO: palette.CO[500],
    accentCM: palette.CM[500],

    // Background
    backgroundPrimary: palette.white,
    backgroundSecondary: palette.neutral[200],
    backgroundTertiary: palette.neutral[100],
    backgroundElevated: palette.white,
    backgroundAccentCO: palette.CO[500],
    backgroundAccentCM: palette.CM[500],
    backgroundNegative: palette.CO[500],
    backgroundPositive: palette.CM[500],

    // Foreground
    textPrimary: palette.neutral[1000],
    textSecondary: palette.neutral[800],
    textTertiary: palette.neutral[600],
    textLight: palette.neutral[500],
    textInverse: palette.white,
    textAccentCO: palette.CO[500],
    textAccentCM: palette.CM[500],
    textNegative: palette.CO[500],
    textPositive: palette.CM[500],

    // Borders
    borderStrong: palette.neutral[1000],
    borderMedium: palette.neutral[400],
    borderSubtle: palette.neutral[300],
    borderLight: palette.neutral[200],
    borderAccentCO: palette.CO[500],
    borderAccentCM: palette.CM[500],

    // Actions
    actionPrimary: palette.CO[500],
    actionPrimaryHover: palette.CO[600],
    actionPositive: palette.CM[500],
    actionNegative: palette.CO[500],

    // State
    stateDisabled: palette.neutral[300],
    stateHover: palette.neutral[200],
    statePressed: palette.neutral[400],
  },

  dark: {
    // Accent
    accentCO: palette.CO[500],
    accentCM: palette.CM[500],

    // Background
    backgroundPrimary: palette.neutral[1000],
    backgroundSecondary: palette.neutral[800],
    backgroundTertiary: palette.neutral[700],
    backgroundElevated: palette.neutral[900],
    backgroundAccentCO: palette.CO[500],
    backgroundAccentCM: palette.CM[500],
    backgroundNegative: palette.CO[500],
    backgroundPositive: palette.CM[500],

    // Foreground
    textPrimary: palette.white,
    textSecondary: palette.neutral[200],
    textTertiary: palette.neutral[300],
    textLight: palette.neutral[400],
    textInverse: palette.neutral[1000],
    textAccentCO: palette.CO[500],
    textAccentCM: palette.CM[500],
    textNegative: palette.CO[500],
    textPositive: palette.CM[500],

    // Borders
    borderStrong: palette.white,
    borderMedium: palette.neutral[500],
    borderSubtle: palette.neutral[600],
    borderLight: palette.neutral[700],
    borderAccentCO: palette.CO[500],
    borderAccentCM: palette.CM[500],

    // Actions
    actionPrimary: palette.CO[500],
    actionPrimaryHover: palette.CO[400],
    actionPositive: palette.CM[500],
    actionNegative: palette.CO[500],

    // State
    stateDisabled: palette.neutral[600],
    stateHover: palette.neutral[700],
    statePressed: palette.neutral[500],
  },
};
