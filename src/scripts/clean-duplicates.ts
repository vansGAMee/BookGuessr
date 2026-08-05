import fs from "fs";
import path from "path";

const PROJECTS_DIR = path.join(process.cwd(), "src", "content", "projects");
const PUBLIC_DIR = path.join(process.cwd(), "public", "projects");

// Remove .bak.json files from src/content/projects/
const bakFiles = ["mangal.bak.json", "mq-chess-profile-analyzer.bak.json", "offline-scanner.bak.json"];
for (const bak of bakFiles) {
  const p = path.join(PROJECTS_DIR, bak);
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
    console.log(`Removed backup file from content dir: ${bak}`);
  }
}

// Rename mangal image
const oldMangalImg = path.join(PUBLIC_DIR, "mangal", "______________2026-08-05_133430.png");
const newMangalImg = path.join(PUBLIC_DIR, "mangal", "mangal-20260805-133430.png");
if (fs.existsSync(oldMangalImg)) {
  fs.renameSync(oldMangalImg, newMangalImg);
  console.log("Renamed mangal image to safe name.");
}

// Update mangal.json
const mangalJsonPath = path.join(PROJECTS_DIR, "mangal.json");
if (fs.existsSync(mangalJsonPath)) {
  const json = JSON.parse(fs.readFileSync(mangalJsonPath, "utf-8"));
  json.media = [
    {
      type: "image",
      src: "/projects/mangal/mangal-20260805-133430.png",
      alt: { ru: "Скриншот интерфейса Mangal", en: "Mangal interface screenshot" }
    }
  ];
  fs.writeFileSync(mangalJsonPath, JSON.stringify(json, null, 2), "utf-8");
  console.log("Updated mangal.json media path.");
}

// Rename offline scanner image
const oldOfflineImg = path.join(PUBLIC_DIR, "offline-scanner", "______________2026-08-05_133522.png");
const newOfflineImg = path.join(PUBLIC_DIR, "offline-scanner", "offline-scanner-20260805-133522.png");
if (fs.existsSync(oldOfflineImg)) {
  fs.renameSync(oldOfflineImg, newOfflineImg);
  console.log("Renamed offline-scanner image to safe name.");
}

// Update offline-scanner.json
const offlineJsonPath = path.join(PROJECTS_DIR, "offline-scanner.json");
if (fs.existsSync(offlineJsonPath)) {
  const json = JSON.parse(fs.readFileSync(offlineJsonPath, "utf-8"));
  json.media = [
    {
      type: "image",
      src: "/projects/offline-scanner/offline-scanner-20260805-133522.png",
      alt: { ru: "Скриншот интерфейса OfflineScanner", en: "OfflineScanner interface screenshot" }
    }
  ];
  fs.writeFileSync(offlineJsonPath, JSON.stringify(json, null, 2), "utf-8");
  console.log("Updated offline-scanner.json media path.");
}
