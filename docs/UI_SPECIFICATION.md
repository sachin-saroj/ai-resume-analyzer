# Bio-Architectural Design System Specification

## 1. Design Vision & Philosophy
The ResumeIQ PRO redesign transitions from generic SaaS aesthetics to an organic, high-precision bio-architectural editorial aesthetic inspired by modern organic retreats. The UI balances serene, luminous sage palettes with deep forest-noir contrasts and warm bronze accents.

## 2. Color Palette & Tokens
- **Canvas (Light):** `#F6F8F5` — Luminous soft sage canvas
- **Canvas (Dark):** `#0D130E` — Deep forest obsidian
- **Primary Text (Light):** `#141C15` — Deep charcoal
- **Primary Text (Dark):** `#FFFFFF` — Crisp pure white
- **Accent Bronze:** `#C27838` / `#D68D4D` — Warm amber bronze
- **Pastel Celadon:** `#E5EFE4` / `#162217` — Calibrated matrix surface
- **Architectural Dark:** `#121A13` / `#090E0A` — Deep showcase container

## 3. Geometry & Radii
- **Floating Capsules:** `rounded-full` (Navigation bar, status chips, CTA actions)
- **Large Content Cards:** `rounded-[28px]` – `rounded-[36px]`
- **Interactive Inputs:** `rounded-xl` with mandatory `focus-visible:ring-1 focus-visible:ring-[#c27838]`

## 4. Interactive Micro-Interactions (Skiper UI)
- `Link000`: Underline Left-to-Right
- `Link001`: Underline Left-to-Right + 45° arrow reveal
- `Link004`: Cursor.com-style vertical height-reveal expansion
- `Link005`: Cursor.com-style horizontal pill expansion
- `SpotlightCard`: Luxury radial gradient tracking mouse position
- `ScrollProgress`: Spring-interpolated top viewport progress bar
