import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

test.describe("VANSGAMEE Portfolio Studio & Production Verification Suite", () => {
  test("1. Home page loads and displays author name and hero", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Ivan Kulkin|vansGAMee/i);
    await expect(page.locator("h1")).toContainText(/ИВАН КУЛЬКИН|IVAN KULKIN/);
  });

  test("2. Renders all 5 unique projects without duplicates on home page", async ({ page }) => {
    await page.goto("/");

    const projectSlugs = [
      "business-toolkit",
      "mangal",
      "mq-chess-profile-analyzer",
      "chess-insights",
      "offline-scanner",
    ];

    for (const slug of projectSlugs) {
      const elements = page.locator(`#${slug}`);
      await expect(elements).toHaveCount(1);
    }
  });

  test("3. All project images respond with HTTP 200", async ({ page }) => {
    await page.goto("/");
    const images = page.locator("img");
    const count = await images.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const src = await images.nth(i).getAttribute("src");
      if (src && (src.includes("/projects/") || src.includes("%2Fprojects%2F"))) {
        const res = await page.request.get(src);
        expect(res.status()).toBe(200);
      }
    }
  });

  test("4. Open Studio, select Mangal, save project and verify no duplicate JSON files", async ({ page }) => {
    await page.goto("/studio");
    await expect(page.getByText(/PORTFOLIO STUDIO/)).toBeVisible();

    // Select Mangal project
    await page.getByRole("button", { name: /Mangal Constructor/i }).first().click();

    // Click Save Project
    const saveBtn = page.getByRole("button", { name: /Save Project/i });
    await expect(saveBtn).toBeVisible();
    await saveBtn.click();

    await expect(page.getByText(/Project saved successfully!/)).toBeVisible();

    // Check disk: mangal.json is the ONLY file for mangal in src/content/projects/
    const projectsDir = path.join(process.cwd(), "src", "content", "projects");
    const files = fs.readdirSync(projectsDir);
    const mangalFiles = files.filter((f) => f.startsWith("mangal") && f.endsWith(".json"));

    expect(mangalFiles).toEqual(["mangal.json"]);

    // Reload Studio and verify media/images display
    await page.reload();
    await expect(page.getByText(/PORTFOLIO STUDIO/)).toBeVisible();

    // Open Home Page and verify Mangal is displayed exactly once
    await page.goto("/");
    const mangalSections = page.locator("#mangal");
    await expect(mangalSections).toHaveCount(1);
  });

  test("5. Opens single project detail page for MQ-Chess Profile Analyzer", async ({ page }) => {
    await page.goto("/projects/mq-chess-profile-analyzer");
    await expect(page.locator("h1")).toContainText("MQ-Chess Profile Analyzer");
    await expect(page.getByText("PROJECT SPECIFICATION")).toBeVisible();
  });
});
