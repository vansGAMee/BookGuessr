import fs from "fs";
import path from "path";
import sharp from "sharp";

const INCOMING_DIR = path.join(process.cwd(), "incoming-assets");
const PUBLIC_PROJECTS_DIR = path.join(process.cwd(), "public", "projects");

async function main() {
  console.log("=== VANSGAMEE Media Optimizer ===");

  if (!fs.existsSync(INCOMING_DIR)) {
    console.log("No incoming-assets folder found. Nothing to optimize.");
    return;
  }

  const entries = fs.readdirSync(INCOMING_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const slug = entry.name;
    const srcDir = path.join(INCOMING_DIR, slug);
    const destDir = path.join(PUBLIC_PROJECTS_DIR, slug);

    fs.mkdirSync(destDir, { recursive: true });

    const files = fs.readdirSync(srcDir);
    for (const file of files) {
      if (!/\.(png|jpe?g|webp)$/i.test(file)) continue;

      const srcFile = path.join(srcDir, file);
      const destFile = path.join(destDir, file);

      console.log(`Optimizing image: ${slug}/${file}...`);

      try {
        await sharp(srcFile)
          .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
          .png({ quality: 85, compressionLevel: 8 })
          .toFile(destFile + ".tmp");

        fs.renameSync(destFile + ".tmp", destFile);
        console.log(` Saved optimized asset to ${destFile}`);
      } catch (err) {
        console.error(` Failed to optimize ${file}:`, err);
      }
    }
  }

  console.log("=== Media Optimization Complete ===");
}

main().catch(console.error);
