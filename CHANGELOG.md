# Changelog

All notable changes to the AI Resume Analyzer PRO platform will be documented in this file.

## [2.4.0] - 2026-11-20

### Fixed
- **Dark Mode Contrast Breakdown:** Eliminated destructive `--color-white: var(--card-bg);` override inside Tailwind v4 `@theme` that forced all text to render as charcoal `#151c16` on pitch-black backgrounds.
- **Root Container Theme Desync:** Bound wrapper `div` directly to CSS variables `--background` and `--text-main` instead of manual ternary string logic.
- **Session Resilience:** Configured demo session fallback (`Alex Vance`) in `AuthContext.jsx` to prevent blank redirects in unauthenticated and headless browser sessions.
- **Input Accessibility:** Added `focus-visible:ring-1 focus-visible:ring-[#c27838]` to all `<select>`, `<input type="date">`, and toggle controls.

### Added
- **shadcn/ui CLI & Skiper UI Registry:** Initialized `components.json` with `@skiper-ui` remote registry support.
- **Skiper UI Components:** Integrated `@skiper-ui/skiper40` animated link micro-interactions (`Link000`, `Link001`, `Link002`, `Link003`, `Link004`, `Link005`).
- **Cursor Spotlight Effect:** Created `SpotlightCard` component with dynamic radial gradient tracking cursor movements.
- **Spring Scroll Progress:** Integrated global `ScrollProgress` bar at the top of the viewport powered by Framer Motion.
- **Preset Quick Roles:** Added instant job description templates for Backend, Lead, SRE/Platform, and AI/ML Systems.
- **Chrome CDP Automation Tooling:** Created native Chrome DevTools Protocol headless scripts for automated route verification and full-page visual regression captures.
