import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";

async function main() {
  const outDir = path.join(process.cwd(), "docs", "baseline-screenshots");
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { name: "desktop_1440x1000", width: 1440, height: 1000 },
    { name: "desktop_1920x1080", width: 1920, height: 1080 },
    { name: "mobile_390x844", width: 390, height: 844, isMobile: true },
    { name: "mobile_360x800", width: 360, height: 800, isMobile: true },
  ];

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile || false,
    });
    const page = await context.newPage();
    try {
      await page.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 30000 });
      await page.screenshot({ path: path.join(outDir, `${vp.name}_home.png`), fullPage: false });
      console.log(`Saved baseline screenshot: ${vp.name}_home.png`);
    } catch (err) {
      console.error(`Failed to capture ${vp.name}:`, err);
    } finally {
      await context.close();
    }
  }

  await browser.close();
  console.log("Baseline screenshot capture complete!");
}

main().catch(console.error);
