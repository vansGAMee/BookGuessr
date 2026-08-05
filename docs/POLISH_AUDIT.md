# VANSGAMEE / UNDER THE SURFACE — Baseline & Polish Audit

## 1. Project Manifest & Architecture Audit
- **Current State**: 4 projects loaded (`business-toolkit`, `mangal`, `chess-insights`, `offline-scanner`).
- **Required Update**: Manifest must contain **5 distinct projects**:
  1. `business-toolkit`: Web tools / File processing (Live: `https://business-toolkit-alpha.vercel.app/`).
  2. `mangal`: Website Constructor for restaurants (Repo: `https://github.com/vansGAMee/mangal-site`, status `in-development`, `showLive: false`, `previewUrl` support).
  3. `mq-chess-profile-analyzer`: **NEW SEPARATE CASE** (Live: `https://mq-chess-site.vercel.app/`, Repo: `https://github.com/vansGAMee/MQ-Chess`, status `frontend-demo`, liveMode `frontend-demo`, availability note: "Frontend data preview / backend not continuously deployed", includes Bklit Radar Chart).
  4. `chess-insights`: Personal chess statistics across 20 metrics (Live: `https://vansgamee.github.io/chess-insights/`, relatedProjects: `["mq-chess-profile-analyzer"]`).
  5. `offline-scanner`: Android offline data scanner (Repo: `https://github.com/vansGAMee/OfflineScanner`, status `code-only`, Kotlin / Jetpack Compose / Rust / JNI).
- **Schema Updates**: Extend Zod schema in `src/lib/projects/schema.ts` with `liveMode`, `previewUrl`, `availabilityNote`, `relatedProjects`, and `frontend-demo` status.

## 2. Visual & Animation Seams (Emil Kowalski Design Engineering Rules)
- **Hero & Entry**: Static fragment background needs to be replaced with **`ProjectFilm`** — an interactive moving editorial strip of real project screenshots with 3D depth, active frame sync, and touch swipe.
- **Signature Component**: Missing **`ProjectFingerprint`** — deterministic SVG signature for each project generated from slug, stack, type, status, and media count.
- **X-Ray Optical Lens**: Needs refined optical edge border, subtle chromatic fringe, soft shadow, `SOURCE` badge label, and smooth full-screen expansion.
- **Project Index**: Needs right-side hover preview on desktop and inline touch preview on mobile.
- **Button Press Feedback**: Add `transform: scale(0.97)` active states with sub-300ms custom ease-out curves (`cubic-bezier(0.23, 1, 0.32, 1)`).

## 3. Deployment & Vercel Asset Safeguards
- Need automated prebuild script `pnpm media:check` (`src/scripts/check-media.ts`) to verify all media paths exist, match exact case, use leading `/`, use local `public/` assets, and prevent broken images on Vercel Hobby deployments.
