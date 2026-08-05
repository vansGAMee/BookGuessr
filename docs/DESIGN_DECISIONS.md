# VANSGAMEE — Design Decisions & Rationale

## 1. Direction Selection
- **Chosen Direction**: Editorial Optical Interface (`SHOWCASE / SOURCE` dual-layer reveal).
- **Rationale**: Elevates Ivan Kulkin's work into an authoritative editorial showcase while revealing the real source code, stack, limitations, and technical facts beneath an interactive optical lens.
- **Rejected Directions**:
  - *Gamified OS / Cyberpunk Terminal*: Hidden content behind novelty UI, poor accessibility, distracting.
  - *Generic SaaS Dashboard / Bento Grid*: Overused layout templates with purple gradients and glow clouds.
  - *Single 3D WebGL Canvas*: Heavy load times, performance hits on mobile, irrelevant 3D shapes.

## 2. Typography Rationale
- **Header Font**: `Unbounded` (Google Font) — Variable weight, distinctive geometry, excellent Cyrillic support for Ivan Kulkin's name and headlines.
- **Body Font**: `Onest` (Google Font) — Designed specifically for reading interface text in Cyrillic & Latin.
- **Mono Font**: `IBM Plex Mono` (Google Font) — Industrial precision for the `SOURCE` blueprint layer.

## 3. Color Tokens & Contrast
- Tested against WCAG AA standards:
  - Light Editorial: `#F8F7F4` background with `#121316` text (contrast ratio > 16:1).
  - Dark Blueprint: `#0B0D10` background with `#EDF1F7` text (contrast ratio > 17:1) and `#3B82F6` signal blue accents.

## 4. X-Ray Lens Mechanics
- Built using CSS masking (`clip-path: circle(...)` / `mask-image: radial-gradient(...)`) driven by Framer Motion / Motion values (`useMotionValue`, `useSpring`).
- Performs 60 FPS transform/mask updates without causing React re-renders or layout thrashing.
- Automatically disabled on touch screens / coarse pointer devices in favor of a responsive mode switch and split-view divider.
