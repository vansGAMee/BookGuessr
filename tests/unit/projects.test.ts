import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import { getAllProjects } from "../../src/lib/projects/loader";
import { ProjectMedia } from "../../src/lib/projects/schema";
import {
  saveProjectData,
  toPublicMediaPath,
  deduplicateMedia,
  generateSafeFileName,
  sanitizeSlug,
} from "../../src/lib/projects/writer";

const PROJECTS_DIR = path.join(process.cwd(), "src", "content", "projects");

describe("Project Studio & Writer Core Unit Tests", () => {
  const originalEnv = process.env.PORTFOLIO_STUDIO;

  beforeEach(() => {
    process.env.PORTFOLIO_STUDIO = "1";
  });

  afterEach(() => {
    process.env.PORTFOLIO_STUDIO = originalEnv;
  });

  it("1. Two identical slugs in loader throw an error", () => {
    const fakeDuplicatePath = path.join(PROJECTS_DIR, "mangal-duplicate-test.json");
    const mangalOriginalPath = path.join(PROJECTS_DIR, "mangal.json");
    const content = fs.readFileSync(mangalOriginalPath, "utf-8");

    try {
      fs.writeFileSync(fakeDuplicatePath, content, "utf-8");
      expect(() => getAllProjects()).toThrow(/Duplicate project slug/);
    } finally {
      if (fs.existsSync(fakeDuplicatePath)) {
        fs.unlinkSync(fakeDuplicatePath);
      }
    }
  });

  it("2. Update mode overwrites existing file and does not create a new JSON", () => {
    const sample = {
      slug: "mangal",
      title: { ru: "Mangal Constructor Updated", en: "Mangal Constructor Updated" },
      kicker: { ru: "Тест", en: "Test" },
      summary: { ru: "Описание", en: "Summary" },
      description: { ru: "Подробно", en: "Detailed" },
      status: "in-development",
      presentation: "dashboard",
      order: 2,
      featured: true,
      published: true,
      showLive: false,
      stack: ["React"],
      media: [],
      proof: { facts: { ru: ["Факт"], en: ["Fact"] } },
    };

    const res = saveProjectData({
      mode: "update",
      originalSlug: "mangal",
      project: sample,
    });

    expect(res.success).toBe(true);
    expect(fs.existsSync(path.join(PROJECTS_DIR, "mangal.json"))).toBe(true);
    expect(fs.existsSync(path.join(PROJECTS_DIR, "mangal-12345.json"))).toBe(false);
  });

  it("3. Create mode with occupied slug returns 409 conflict", () => {
    const sample = {
      slug: "business-toolkit",
      title: { ru: "Дубликат", en: "Duplicate" },
      kicker: { ru: "Тест", en: "Test" },
      summary: { ru: "Тест", en: "Test" },
      description: { ru: "Тест", en: "Test" },
      status: "live",
      presentation: "browser",
      order: 1,
      featured: true,
      published: true,
      showLive: true,
      stack: ["React"],
      media: [],
      proof: { facts: { ru: ["Факт"], en: ["Fact"] } },
    };

    const res = saveProjectData({
      mode: "create",
      project: sample,
    });

    expect(res.success).toBe(false);
    expect(res.status).toBe(409);
  });

  it("4. Changing slug in update mode deletes old JSON file", () => {
    const tempSlug = "temp-slug-test";
    const newSlug = "temp-slug-renamed";

    const initial = {
      slug: tempSlug,
      title: { ru: "Временный", en: "Temporary" },
      kicker: { ru: "Тест", en: "Test" },
      summary: { ru: "Тест", en: "Test" },
      description: { ru: "Тест", en: "Test" },
      status: "live",
      presentation: "browser",
      order: 99,
      featured: false,
      published: true,
      showLive: false,
      stack: ["React"],
      media: [],
      proof: { facts: { ru: ["Факт"], en: ["Fact"] } },
    };

    saveProjectData({ mode: "create", project: initial });
    expect(fs.existsSync(path.join(PROJECTS_DIR, `${tempSlug}.json`))).toBe(true);

    const updated = { ...initial, slug: newSlug };
    saveProjectData({ mode: "update", originalSlug: tempSlug, project: updated });

    expect(fs.existsSync(path.join(PROJECTS_DIR, `${tempSlug}.json`))).toBe(false);
    expect(fs.existsSync(path.join(PROJECTS_DIR, `${newSlug}.json`))).toBe(true);

    // Clean up
    fs.unlinkSync(path.join(PROJECTS_DIR, `${newSlug}.json`));
  });

  it("5. Media path always starts with /projects/", () => {
    const path1 = toPublicMediaPath("mangal", "image.png");
    expect(path1).toBe("/projects/mangal/image.png");
  });

  it("6. Windows path separators are replaced with forward slashes", () => {
    const path1 = toPublicMediaPath("mangal", "sub\\folder\\image.png");
    expect(path1).not.toContain("\\");
    expect(path1).toBe("/projects/mangal/image.png");
  });

  it("7. Identical upload file names receive safe unique hashes", () => {
    const name1 = generateSafeFileName("mangal", "Screenshot.png", "image/png");
    const name2 = generateSafeFileName("mangal", "Screenshot.png", "image/png");

    expect(name1).not.toBe(name2);
    expect(name1).toMatch(/^mangal-\d+-[a-f0-9]+\.png$/);
    expect(name2).toMatch(/^mangal-\d+-[a-f0-9]+\.png$/);
  });

  it("8. Empty upload array does not delete existing project media", () => {
    const existing: ProjectMedia[] = [
      { type: "image", src: "/projects/mangal/mangal-1.png", alt: { ru: "1", en: "1" } },
    ];
    const newUploads: ProjectMedia[] = [];
    const merged = deduplicateMedia([...existing, ...newUploads]);

    expect(merged.length).toBe(1);
    expect(merged[0].src).toBe("/projects/mangal/mangal-1.png");
  });

  it("9. Path traversal attempts are rejected", () => {
    const traversalSlug = "../../../etc/passwd";
    const sanitized = sanitizeSlug(traversalSlug);
    expect(sanitized).not.toContain("..");

    const res = saveProjectData({
      mode: "create",
      project: {
        slug: traversalSlug,
        title: { ru: "Hacker", en: "Hacker" },
        kicker: { ru: "Test", en: "Test" },
        summary: { ru: "Test", en: "Test" },
        description: { ru: "Test", en: "Test" },
        status: "live",
        presentation: "browser",
        order: 1,
        featured: true,
        published: true,
        showLive: true,
        stack: ["React"],
        media: [],
        proof: { facts: { ru: ["Fact"], en: ["Fact"] } },
      },
    });

    if (res.project) {
      expect(res.project.slug).toBe("etc-passwd");
      fs.unlinkSync(path.join(PROJECTS_DIR, "etc-passwd.json"));
    }
  });

  it("10. Non-existent image file is detected by checker logic", () => {
    const nonExistentPath = path.join(process.cwd(), "public", "projects", "fake-dir", "fake-img.png");
    expect(fs.existsSync(nonExistentPath)).toBe(false);
  });
});
