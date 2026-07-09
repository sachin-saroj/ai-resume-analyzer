# UI Redesign Plan — ai-resume-analyzer Dashboard (Clean Minimalist)

## Reference DNA (from Clean Minimalist Email-Client Dashboard)
- **Light mode only for now**: Background is a soft neutral gray/lavender-white (`#F5F5F7`), NOT pure white, NOT dark.
- **Content lives in white cards**: White background, `rounded-2xl` corners, very soft barely-visible shadow (`shadow-sm`, no heavy drop shadows), floating above background, no borders.
- **Near-zero color usage**: 95% grayscale/black text on white/gray. Colors appear only in small deliberate accents: one status pill, one primary action button, small circular icon badges.
- **Circular avatar/icon containers**: Small colored circle backgrounds (soft pastel fill) holding a simple icon or initial instead of square containers.
- **Restrained Typography**: Small text (13-15px body), medium weight, tight line-height. Headings are only slightly larger, not oversized.
- **Thin dividers**: 1px thin dividers between list items instead of gaps/cards for repeated list content.
- **Paddings & gaps**: Generous internal padding inside cards, but cards sit close together with small gaps — dense-but-calm feel.
- **Status Pills**: Small, fully rounded pills, colored fill with white text (red="Urgent", gray="To-do"). Reused for skill priority (Critical/Medium/Low).
- **Buttons**: Small, `rounded-lg` (not pill, not sharp square) — solid black/dark for primary, outline/ghost for secondary.
- **Accent Color**: ONE accent color for primary actions — solid black/dark charcoal, with minor accents in soft blue/slate. No purple, orange, or gradients.

## Current Problems to Solve
- Coral/orange color accents, gradients, and breathing blobs from previous iteration are too heavy and loud.
- Mixed/asymmetrical card corner-radii (`rounded-[40px_4px_40px_4px]`) violate the clean minimalist aesthetic.
- Buttons and active items are rounded-full/pill shaped, which must be converted to small, clean `rounded-lg` elements.
- Section margins and paddings are inconsistent with a compact, dense-but-calm email-client dashboard view.

## Tasks Checklist
- [x] 0a. Build Real, Distinct Analytics Page (GET /api/analytics/summary database calculations and trend Area/Bar charts)
- [x] 0b. Build Real, Distinct Schedule Page (Application model, CRUD controller, Kanban grouped list tracker, and analyses dropdown)
- [x] 0c. Build Real, Distinct Help Page (weighted formula FAQ, searchable client-side accordion filter, mailto support)
- [x] 0d. Build Real, Distinct Settings Page (profile PUT /api/auth/me, password re-hasher PUT /api/auth/me/password, theme context toggle)
- [ ] 1. Update design tokens in `index.css`: Change base background to `#F5F5F7`, primary accent to solid black, and map legacy Tailwind colors (indigo, purple, slate) to grayscale/neutral tokens.
- [ ] 2. Rework Dashboard `Sidebar`: Convert to a quiet icon-rail + labeled-list hybrid, using subtle `rounded-lg` highlight on active items and removing points/info gradients.
- [ ] 3. Rework Dashboard `Navbar`: Align to clean minimalist design, small `rounded-lg` search input and buttons, grayscale tone.
- [ ] 4. Rework Dashboard `Score Card`: Remove orange blob and marquee ticker. Display large but restrained score number, thin circular progress ring in black/dark gray, and muted label.
- [ ] 5. Rework Dashboard `Missing Skills` card: Style as a list using circular icon badges + titles + subtext + thin 1px dividers, not boxed cards.
- [ ] 6. Rework Dashboard panels: Apply white cards, `rounded-2xl` corners, shadow-sm, and remove all gradients (including predicted salary and target resume upload blocks).
- [ ] 7. Update priority badges: Map Critical, Medium, Low skill priority to small solid-color pills (e.g. red for critical, gray for standard) matching the reference design.
- [ ] 8. Rework `History` Page: Format version cards with thin dividers, minimalist table/list style, and clean delta badges.
- [ ] 9. Verify changes: Ensure code compiles without errors.
