import fs from "fs";
import path from "path";

const PROJECTS_DIR = path.join(process.cwd(), "src", "content", "projects");
const PUBLIC_DIR = path.join(process.cwd(), "public");

function checkMedia() {
  console.log("=== VANSGAMEE Production Media & Asset Auditor ===");

  if (!fs.existsSync(PROJECTS_DIR)) {
    console.error("❌ Projects directory not found:", PROJECTS_DIR);
    process.exit(1);
  }

  const projectFiles = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith(".json"));
  let errors = 0;

  const seenSlugs = new Map<string, string>();
  const seenMediaSrcs = new Map<string, string>();

  for (const file of projectFiles) {
    const filePath = path.join(PROJECTS_DIR, file);
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const project = JSON.parse(content);

      // Check 1: Unique slug
      if (project.slug) {
        const previousFile = seenSlugs.get(project.slug);
        if (previousFile) {
          console.error(`❌ Duplicate project slug "${project.slug}" in "${previousFile}" and "${file}"`);
          errors++;
        } else {
          seenSlugs.set(project.slug, file);
        }
      }

      if (!project.media || !Array.isArray(project.media)) continue;

      for (const item of project.media) {
        const src = item.src;
        if (!src) continue;

        // Check 2: Unique media.src across projects
        const previousMediaFile = seenMediaSrcs.get(src);
        if (previousMediaFile && previousMediaFile !== file) {
          console.warn(`⚠️ Media src "${src}" reused in "${previousMediaFile}" and "${file}"`);
        }
        seenMediaSrcs.set(src, file);

        // Check 3: Leading slash
        if (!src.startsWith("/")) {
          console.error(`❌ [${file}] Image path must start with '/': "${src}"`);
          errors++;
        }

        // Check 4: No backslashes
        if (src.includes("\\")) {
          console.error(`❌ [${file}] Backslash '\\' detected in path: "${src}"`);
          errors++;
        }

        // Check 5: No local Windows paths or file://
        if (src.includes("file://") || src.includes(":\\") || src.includes("c:")) {
          console.error(`❌ [${file}] Local OS path or file:// URL detected: "${src}"`);
          errors++;
        }

        // Check 6: Allowed image extension
        if (!/\.(png|jpe?g|webp|avif)$/i.test(src)) {
          console.error(`❌ [${file}] Invalid image extension for "${src}". Allowed: png, jpg, jpeg, webp, avif`);
          errors++;
        }

        // Check 7: File existence inside public/
        const relativePath = src.substring(1); // strip leading slash
        const fullPath = path.join(PUBLIC_DIR, relativePath);

        if (!fs.existsSync(fullPath)) {
          console.error(`❌ [${file}] Image file not found on disk: "${fullPath}"`);
          errors++;
        } else {
          // Check 8: Non-empty file
          const stats = fs.statSync(fullPath);
          if (stats.size === 0) {
            console.error(`❌ [${file}] Empty 0-byte image file detected: "${fullPath}"`);
            errors++;
          }

          // Check 9: Exact case match on disk
          const dir = path.dirname(fullPath);
          const base = path.basename(fullPath);
          const actualFiles = fs.readdirSync(dir);
          if (!actualFiles.includes(base)) {
            console.error(`❌ [${file}] Case mismatch! Expected "${base}", found on disk: ${actualFiles.join(", ")}`);
            errors++;
          }
        }

        // Check 10: Alt texts
        if (!item.alt || !item.alt.ru || !item.alt.en) {
          console.error(`❌ [${file}] Missing alt text in RU or EN for media "${src}"`);
          errors++;
        }
      }
    } catch (err) {
      console.error(`❌ Failed to parse ${file}:`, err);
      errors++;
    }
  }

  if (errors > 0) {
    console.error(`\n❌ Media audit failed with ${errors} error(s). Aborting build.`);
    process.exit(1);
  }

  console.log("✓ All media assets & project slugs verified successfully! 0 errors.\n");
}

checkMedia();
