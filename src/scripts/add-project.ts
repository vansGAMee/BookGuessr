import * as p from "@clack/prompts";
import fs from "fs";
import path from "path";
import { ProjectSchema } from "../lib/projects/schema";

async function main() {
  p.intro("VANSGAMEE Portfolio — Interactive Project Creator");

  const slugInput = await p.text({
    message: "Enter project slug (e.g. my-new-tool):",
    placeholder: "my-new-tool",
    validate: (val) => (!val ? "Slug is required" : undefined),
  });
  if (p.isCancel(slugInput)) process.exit(0);

  const slug = String(slugInput).toLowerCase().replace(/[^a-z0-9-]/g, "-");

  const titleRu = await p.text({ message: "Title (RU):", placeholder: "Мой Проект" });
  if (p.isCancel(titleRu)) process.exit(0);
  const titleEn = await p.text({ message: "Title (EN):", placeholder: "My Project" });
  if (p.isCancel(titleEn)) process.exit(0);

  const kickerRu = await p.text({ message: "Kicker (RU):", placeholder: "Веб-сервис" });
  if (p.isCancel(kickerRu)) process.exit(0);
  const kickerEn = await p.text({ message: "Kicker (EN):", placeholder: "Web Service" });
  if (p.isCancel(kickerEn)) process.exit(0);

  const summaryRu = await p.text({ message: "Summary (RU):", placeholder: "Краткое описание" });
  if (p.isCancel(summaryRu)) process.exit(0);
  const summaryEn = await p.text({ message: "Summary (EN):", placeholder: "Short summary" });
  if (p.isCancel(summaryEn)) process.exit(0);

  const status = await p.select({
    message: "Select status:",
    options: [
      { value: "live", label: "Live (Published & working)" },
      { value: "in-development", label: "In Development" },
      { value: "code-only", label: "Code-only (Repository)" },
      { value: "archived", label: "Archived" },
    ],
  });
  if (p.isCancel(status)) process.exit(0);

  const presentation = await p.select({
    message: "Select presentation frame type:",
    options: [
      { value: "browser", label: "Browser Frame" },
      { value: "phone", label: "Phone Frame" },
      { value: "data", label: "Data Visualization Surface" },
      { value: "dashboard", label: "Dashboard Surface" },
      { value: "mixed", label: "Mixed Frame" },
      { value: "code", label: "Code Poster" },
    ],
  });
  if (p.isCancel(presentation)) process.exit(0);

  const liveUrl = await p.text({ message: "Live URL (optional):", placeholder: "https://..." });
  if (p.isCancel(liveUrl)) process.exit(0);

  const repoUrl = await p.text({ message: "GitHub Repository URL (optional):", placeholder: "https://github.com/..." });
  if (p.isCancel(repoUrl)) process.exit(0);

  const stackInput = await p.text({ message: "Stack (comma separated):", placeholder: "Next.js, TypeScript, Tailwind CSS" });
  if (p.isCancel(stackInput)) process.exit(0);
  const stack = String(stackInput).split(",").map((s) => s.trim()).filter(Boolean);

  const projectData = {
    slug,
    title: { ru: String(titleRu), en: String(titleEn) },
    kicker: { ru: String(kickerRu), en: String(kickerEn) },
    summary: { ru: String(summaryRu), en: String(summaryEn) },
    description: { ru: String(summaryRu), en: String(summaryEn) },
    status,
    presentation,
    year: new Date().getFullYear(),
    order: 99,
    featured: true,
    published: true,
    showLive: Boolean(liveUrl),
    liveUrl: String(liveUrl || ""),
    repoUrl: String(repoUrl || ""),
    stack,
    media: [],
    proof: {
      facts: {
        ru: ["Разработано с использованием современно стека"],
        en: ["Built using modern frontend technology stack"],
      },
    },
  };

  const parsed = ProjectSchema.parse(projectData);
  const jsonPath = path.join(process.cwd(), "src", "content", "projects", `${slug}.json`);
  const mediaDir = path.join(process.cwd(), "public", "projects", slug);

  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
  fs.mkdirSync(mediaDir, { recursive: true });
  fs.writeFileSync(jsonPath, JSON.stringify(parsed, null, 2), "utf-8");

  p.outro(`Project created successfully!
  - Content: ${jsonPath}
  - Media directory: ${mediaDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
