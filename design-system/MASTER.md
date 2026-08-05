# VANSGAMEE / UNDER THE SURFACE — Design System Master

## Concept & Visual Identity
- **Concept Name**: Editorial Optical Interface (`SHOWCASE` / `SOURCE`)
- **Theme Philosophy**: High-fashion editorial presentation combined with a technical blueprint X-ray optical lens revealing source layer underneath.
- **Dual Layer Architecture**:
  - **SHOWCASE Layer**: Warm editorial off-white backdrop (`#F8F7F4`), deep warm graphite typography (`#121316`), elegant large typography, uncluttered gallery layouts, browser/device frames.
  - **SOURCE Layer**: Deep technical dark slate (`#0B0D10`), cold high-contrast white text (`#EDF1F7`), blueprint grid overlay (`rgba(59, 130, 246, 0.12)`), monospace specs, signal blue accents (`#2563EB` / `#3B82F6`), exact technical metadata.

## Color Palette Tokens
### Showcase (Light Editorial Mode)
- `--bg-showcase`: `#F8F7F4`
- `--fg-showcase`: `#121316`
- `--muted-showcase`: `#64666E`
- `--border-showcase`: `rgba(18, 19, 22, 0.12)`
- `--accent-showcase`: `#1A1D24`

### Source (Dark Blueprint Mode)
- `--bg-source`: `#0B0D10`
- `--fg-source`: `#EDF1F7`
- `--muted-source`: `#8A92A3`
- `--border-source`: `rgba(59, 130, 246, 0.25)`
- `--accent-source`: `#3B82F6` (Signal Tech Blue)
- `--highlight-source`: `#60A5FA`

## Typography System
- **Display Font**: `Unbounded` (Variable, Cyrillic & Latin support) — Bold, technical display headers.
- **Body Font**: `Onest` / `Manrope` — Clean readability for editorial summaries and documentation.
- **Technical Monospace**: `IBM Plex Mono` / `Commit Mono` — Clean technical specs, code snippets, coordinates.

## Motion & Interaction Rules
- **X-Ray Lens**: Smooth follow with spring dynamics (`stiffness: 400`, `damping: 30`). Mask radius smoothly scales on hover. No jitter.
- **Layer Synchronization**: Showcase and Source layers rendered in absolute 1:1 spatial alignment.
- **Mobile Fallback**: Coarse pointer and small viewports automatically replace lens with direct Mode Switch toggle (`SHOWCASE / SOURCE`) and interactive Draggable Split-screen Divider.
- **Reduced Motion**: Respects `prefers-reduced-motion: reduce`. Replaces X-ray cursor with full-page layer toggle.

## Anti-AI Slop Enforcement
- ZERO generic filler ("Crafting digital experiences", "10x developer", "Turning ideas into reality").
- ZERO arbitrary 3D floating meshes, particle canvases, or neon cursor glows.
- ZERO fake skill percentages, progress bars, or fake client logos.
- All facts, stack items, repo URLs, and screenshots map 1:1 to verified projects.
