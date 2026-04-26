// app/src/utils/constants.ts
export const Colors = {
  accent: "#1ed760",
  accentDark: "#1db954",
  background: "#121212",
  surface: "#181818",
  surfaceMid: "#1f1f1f",
  cardElevated: "#252525",
  textPrimary: "#ffffff",
  textSecondary: "#b3b3b3",
  textMuted: "#cbcbcb",
  negative: "#f3727f",
  warning: "#ffa42b",
  info: "#539df5",
  boardLight: "#b7c0d8",
  boardDark: "#779556",
  lastMove: "rgba(30, 215, 96, 0.15)",
  legalMove: "rgba(30, 215, 96, 0.4)",
  check: "rgba(243, 114, 127, 0.3)",
  border: "#4d4d4d",
  borderLight: "#7c7c7c",
} as const;

export const Spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, "2xl": 24, "3xl": 32,
} as const;

export const Radius = {
  sm: 4, md: 6, lg: 8, xl: 12, pill: 9999, circle: 9999 / 2,
} as const;

export const Typography = {
  title: { fontSize: 24, fontWeight: "700" as const },
  heading: { fontSize: 18, fontWeight: "600" as const },
  bodyBold: { fontSize: 16, fontWeight: "700" as const },
  body: { fontSize: 16, fontWeight: "400" as const },
  button: { fontSize: 14, fontWeight: "700" as const, textTransform: "uppercase" as const, letterSpacing: 1.4 },
  nav: { fontSize: 14, fontWeight: "700" as const },
  caption: { fontSize: 14, fontWeight: "400" as const },
  small: { fontSize: 12, fontWeight: "400" as const },
} as const;

export const Shadows = {
  heavy: { shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 24, elevation: 16 },
  medium: { shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
} as const;

export const BREAKPOINT_TABLET = 768;
export const AI_THINK_DELAY = 400;
