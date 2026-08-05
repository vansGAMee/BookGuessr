# VANSGAMEE / UNDER THE SURFACE — Developer Portfolio

Production-ready developer portfolio for **Ivan Kulkin** (GitHub: [`vansGAMee`](https://github.com/vansGAMee)).

## Concept: Under the Surface
The site operates across two synchronized DOM layers:
1. **SHOWCASE Layer**: Editorial presentation layer with clean typography, warm off-white backdrop (`#F8F7F4`), custom presentation frames (Browser, Phone, Data Surface, Technical Cover), live & repository action controls.
2. **SOURCE Layer**: Technical blueprint layer revealing tech stack tags, role, verified facts, architectural constraints, proof metrics, and code-level specs under a dark blueprint backdrop (`#0B0D10`).

On desktop, the `SOURCE` layer is revealed through an interactive **X-ray optical lens** following the cursor smoothly via 60 FPS motion values and springs. Clicking expands the lens to full-screen `SOURCE` mode. On mobile and coarse-pointer devices, a responsive `SHOWCASE / SOURCE` mode switch and touch-draggable split-screen divider are provided.

---

## Tech Stack
- **Framework**: Next.js App Router (TypeScript strict)
- **Styling**: Tailwind CSS
- **Motion**: `motion/react` (Framer Motion)
- **Validation**: Zod
- **Testing**: Vitest (Unit tests) & Playwright (E2E & automated live project screenshot capture)
- **Image Processing**: Sharp
- **CLI Wizard**: `@clack/prompts` & `tsx`

---

## Getting Started

### Installation
```bash
pnpm install
```

### Development Mode
```bash
pnpm dev
```
Open `http://localhost:3000` to view the portfolio.

### Local Studio (GUI Editor)
To launch the built-in local GUI project editor:
```bash
pnpm studio
```
Open `http://localhost:3000/studio` in your browser. (Returns 404 in production).

---

## Commands & Verification

| Command | Purpose |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm studio` | Start local Studio GUI editor mode (`PORTFOLIO_STUDIO=1`) |
| `pnpm build` | Production Next.js build |
| `pnpm lint` | Run ESLint check |
| `pnpm typecheck` | Run TypeScript strict check |
| `pnpm test` | Run Vitest unit tests |
| `pnpm test:e2e` | Run Playwright E2E test suite |
| `pnpm project:add` | Interactive CLI wizard to add a new project |
| `pnpm capture:projects` | Playwright script to capture live screenshots |
| `pnpm media:optimize` | Sharp script to process & compress raw incoming assets |

---

## Verified Projects Manifest
1. **BusinessToolkit**: Web tools / File processing (`https://business-toolkit-alpha.vercel.app/`). Live demo, browser frame presentation.
2. **Mangal Constructor**: Site constructor for restaurants (`https://github.com/vansGAMee/mangal-site`). In-development status, dashboard presentation frame, live link default hidden.
3. **Chess Insights + MQ-Chess**: Personal chess analytics & custom rating metric (`https://vansgamee.github.io/chess-insights/` & `https://github.com/vansGAMee/MQ-Chess`). Live demo, data visualization surface presentation.
4. **OfflineScanner**: Android offline-first data tool (`https://github.com/vansGAMee/OfflineScanner`). Code-only status, native phone presentation frame.

---

## Deployment (Vercel)
Deploy directly to Vercel:
```bash
vercel --prod
```
The site builds statically with SSG routes for `/` and `/projects/[slug]`. Studio mode (`/studio`) automatically returns 404 in production environments.
