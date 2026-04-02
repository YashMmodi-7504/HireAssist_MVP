export const COLORS = {
  primary: "#1f6fb2", // institutional blue
  sidebar: "#155a8a", // darker sidebar tone
  background: "#f5f7fa",
  surface: "#ffffff",
  text: "#1f2937",
  muted: "#6b7280",
  success: "#0f9d58",
  warn: "#d97706",
  danger: "#dc2626",
  cardBorder: "rgba(15, 23, 42, 0.06)",
  subtleLine: "rgba(15,23,42,0.04)"
};

export const SPACING = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 40
};

export const FONTS = {
  ui: `Inter, Segoe UI, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial`,
  headingWeight: 800,
  uiWeight: 600
};

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 14
};

export const TRANSITIONS = {
  short: '120ms ease',
  medium: '200ms ease'
};

export function shadow(depth = 1) {
  if (depth === 1) return "0 6px 18px rgba(2,6,23,0.08)";
  if (depth === 2) return "0 12px 30px rgba(2,6,23,0.12)";
  return "0 6px 18px rgba(2,6,23,0.08)";
}
