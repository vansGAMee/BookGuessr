# Animation & Craft Audit (Emil Kowalski Philosophy)

## Animation Decision & Craft Review Table

| Before | After | Why |
| --- | --- | --- |
| Static Hero fragment grid | `ProjectFilm` interactive editorial strip | Provides instant tactile preview of real projects with 3D depth and scroll sync |
| Generic project card header | `ProjectFingerprint` deterministic SVG path animation | Generates a unique, reproducible signature for every project using seeded algorithms |
| Instant hover color toggle on buttons | `transform: scale(0.97)` active press feedback (160ms ease-out) | Confirms user press instantly without sluggishness |
| Standard circle lens mask | Optical lens with chromatic fringe, border ring & `SOURCE` tag | Elevates the lens into a realistic digital optical instrument |
| Flat Project Index list | Interactive index with right-side live preview & clip reveal | Connects index items visually to their actual project interface |
| Standard linear transitions | Custom cubic-bezier easing (`cubic-bezier(0.23, 1, 0.32, 1)`) | Prevents sluggish built-in easings; provides strong initial feedback |
| Static chart bars | Animated SVG path draw and responsive bar staggers | Prevents jarring data pop-in while respecting reduced motion |

## Verdict & Motion Guidelines
1. **Duration**: All interactive UI animations capped under 300ms.
2. **GPU Acceleration**: Animating `transform` and `opacity` exclusively.
3. **Interruptibility**: All drag/swipe gestures backed by Framer Motion springs.
4. **Reduced Motion**: Full support for `prefers-reduced-motion: reduce`.
