Design decisions for the HireAssist UI overhaul

Goals
- Present a professional, calm, data-first SaaS UI matching the backend quality.
- Keep implementation lightweight (no heavy frameworks) and deterministic.

Key choices
- Theme tokens (`src/theme.js`) centralize colors, spacing, fonts and shadows for consistent styling.
- Glassmorphism login with strong brand gradient for premium feel, but white cards and light backgrounds on dashboards to prioritize data.
- Small `Card` component (`src/components/Card.jsx`) gives consistent spacing, border, and shadow across dashboards.
- Use Inter font (via Google Fonts) with Segoe UI fallback to maintain enterprise typography.

How to use
- Import tokens: `import { COLORS, FONTS, SPACING } from './theme'`
- Use `Card` to wrap content; pass `style` to customize.

Notes
- No backend APIs changed.
- No new build dependencies were added.
- These changes focus on layout, spacing, color, and typography only.
