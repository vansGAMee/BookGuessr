# Adding New Projects to VANSGAMEE Portfolio

You can add a new project in two ways:

## Method 1: Local Studio (GUI)
1. Run `pnpm studio` (or `PORTFOLIO_STUDIO=1 pnpm dev`).
2. Open `http://localhost:3000/studio` in your browser.
3. Fill out the project details (Title, Summary, Stack, Status, Presentation frame, Live & Repo URLs, Media upload).
4. Click **Save Project**.
5. The project JSON will be validated via Zod and written to `src/content/projects/<slug>.json`, and uploaded media will be saved to `public/projects/<slug>/`.

## Method 2: Interactive CLI Master
1. Run `pnpm project:add` in your terminal.
2. Answer the prompts for slug, title (RU/EN), status, stack, and URLs.
3. The script automatically generates `src/content/projects/<slug>.json` and creates `public/projects/<slug>/`.

## Method 3: Manual File Creation
1. Create a JSON file in `src/content/projects/my-project.json`:
```json
{
  "slug": "my-project",
  "title": {
    "ru": "Мой Проект",
    "en": "My Project"
  },
  "kicker": {
    "ru": "Веб-сервис",
    "en": "Web Service"
  },
  "summary": {
    "ru": "Краткое описание проекта на двух строчках.",
    "en": "Short description of the project in two lines."
  },
  "description": {
    "ru": "Подробности реализации, технологии и архитектура.",
    "en": "Implementation details, technologies, and architecture."
  },
  "status": "live",
  "presentation": "browser",
  "order": 5,
  "featured": true,
  "published": true,
  "showLive": true,
  "liveUrl": "https://example.com",
  "repoUrl": "https://github.com/vansGAMee/my-project",
  "stack": ["Next.js", "TypeScript", "Tailwind CSS"],
  "role": {
    "ru": "Full-stack разработчик",
    "en": "Full-stack Developer"
  },
  "media": [],
  "proof": {
    "facts": {
      "ru": ["Оптимизация производительности", "Offline-first архитектура"],
      "en": ["Performance optimization", "Offline-first architecture"]
    }
  }
}
```
2. Place images inside `public/projects/my-project/`.
3. The portfolio website automatically includes the project in the hero, selected work, project index, portfolio pipeline funnel, and `/projects/my-project` route.
