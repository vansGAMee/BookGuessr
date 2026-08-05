import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";
import { ProjectSchema } from "../lib/projects/schema";

const PROJECTS_DIR = path.join(process.cwd(), "src", "content", "projects");
const PUBLIC_PROJECTS_DIR = path.join(process.cwd(), "public", "projects");

async function main() {
  console.log("=== VANSGAMEE Automated Project Screenshot Capture ===");

  if (!fs.existsSync(PROJECTS_DIR)) {
    console.error("No projects directory found.");
    return;
  }

  const browser = await chromium.launch({ headless: true });
  const contextDesktop = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const contextMobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
  });

  const files = fs.readdirSync(PROJECTS_DIR);

  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const filePath = path.join(PROJECTS_DIR, file);

    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const project = ProjectSchema.parse(JSON.parse(content));

      if (!project.captureLive || !project.liveUrl) {
        console.log(`Skipping capture for ${project.slug} (captureLive: ${project.captureLive})`);
        continue;
      }

      console.log(`Capturing screenshots for ${project.title.en} (${project.liveUrl})...`);

      const outDir = path.join(PUBLIC_PROJECTS_DIR, project.slug);
      fs.mkdirSync(outDir, { recursive: true });

      // Capture Desktop
      try {
        const pageD = await contextDesktop.newPage();
        await pageD.goto(project.liveUrl, { waitUntil: "networkidle", timeout: 30000 });
        await pageD.evaluate(() => document.fonts.ready);
        await pageD.screenshot({ path: path.join(outDir, "desktop.png") });
        await pageD.close();
        console.log(` Saved desktop.png for ${project.slug}`);
      } catch (err) {
        console.warn(` Failed to capture desktop for ${project.slug}:`, err);
      }

      // Capture Mobile
      try {
        const pageM = await contextMobile.newPage();
        await pageM.goto(project.liveUrl, { waitUntil: "networkidle", timeout: 30000 });
        await pageM.evaluate(() => document.fonts.ready);
        await pageM.screenshot({ path: path.join(outDir, "mobile.png") });
        await pageM.close();
        console.log(` Saved mobile.png for ${project.slug}`);
      } catch (err) {
        console.warn(` Failed to capture mobile for ${project.slug}:`, err);
      }

    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }

  await browser.close();
  console.log("=== Capture Complete ===");
}

main().catch(console.error);
