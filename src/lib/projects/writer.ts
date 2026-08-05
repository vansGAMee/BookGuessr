import fs from "fs";
import path from "path";
import crypto from "crypto";
import { Project, ProjectMedia, ProjectSchema } from "./schema";

const PROJECTS_DIR = path.join(process.cwd(), "src", "content", "projects");
const PUBLIC_PROJECTS_DIR = path.join(process.cwd(), "public", "projects");
const BACKUPS_DIR = path.join(process.cwd(), ".backups", "projects");
const TEMP_DIR = path.join(process.cwd(), ".temp", "projects");

export function isStudioEnabled(): boolean {
  return (
    (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") &&
    process.env.PORTFOLIO_STUDIO === "1"
  );
}

export function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function toPublicMediaPath(slug: string, fileName: string): string {
  const safeSlug = sanitizeSlug(slug);
  const cleanFileName = fileName.replaceAll("\\", "/").split("/").pop() || fileName;
  return `/projects/${safeSlug}/${cleanFileName}`.replaceAll("\\", "/");
}

export function deduplicateMedia(mediaList: ProjectMedia[]): ProjectMedia[] {
  const seen = new Set<string>();
  const result: ProjectMedia[] = [];

  for (const item of mediaList) {
    if (!item.src) continue;
    const normalized = item.src.replaceAll("\\", "/").trim();
    if (!seen.has(normalized)) {
      seen.add(normalized);
      result.push({
        ...item,
        src: normalized,
      });
    }
  }

  return result;
}

export function generateSafeFileName(slug: string, originalName: string, mimeType?: string): string {
  const safeSlug = sanitizeSlug(slug);
  const extMatch = originalName.match(/\.(png|jpe?g|webp|avif)$/i);
  let ext = extMatch ? extMatch[1].toLowerCase() : "";

  if (!ext && mimeType) {
    if (mimeType === "image/png") ext = "png";
    else if (mimeType === "image/jpeg") ext = "jpg";
    else if (mimeType === "image/webp") ext = "webp";
    else if (mimeType === "image/avif") ext = "avif";
  }

  if (!ext) ext = "png";
  if (ext === "jpeg") ext = "jpg";

  const timestamp = Date.now();
  const hash = crypto.randomBytes(4).toString("hex");

  const fileName = `${safeSlug}-${timestamp}-${hash}.${ext}`;
  // Ensure name matches [a-z0-9-_.]
  return fileName.toLowerCase().replace(/[^a-z0-9-_.]/g, "-");
}

export interface SaveProjectPayload {
  mode?: "create" | "update";
  originalSlug?: string;
  project: unknown;
}

export interface SaveProjectResult {
  success: boolean;
  status?: number;
  project?: Project;
  error?: string;
}

function atomicWriteProjectJson(targetPath: string, project: Project) {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  const tempFileName = `${project.slug}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.tmp`;
  const tempPath = path.join(TEMP_DIR, tempFileName);

  // 1. Write temp file
  const jsonContent = JSON.stringify(project, null, 2);
  fs.writeFileSync(tempPath, jsonContent, "utf-8");

  // 2. Validate via Zod from disk
  const readBack = JSON.parse(fs.readFileSync(tempPath, "utf-8"));
  ProjectSchema.parse(readBack);

  // 3. Rename/move temp file to final destination
  const targetDir = path.dirname(targetPath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  fs.renameSync(tempPath, targetPath);
}

function createBackup(slug: string, filePath: string) {
  if (!fs.existsSync(filePath)) return;
  if (!fs.existsSync(BACKUPS_DIR)) {
    fs.mkdirSync(BACKUPS_DIR, { recursive: true });
  }
  const timestamp = Date.now();
  const backupFileName = `${slug}-${timestamp}.json`;
  const backupPath = path.join(BACKUPS_DIR, backupFileName);
  fs.copyFileSync(filePath, backupPath);
}

export function saveProjectData(payload: SaveProjectPayload | unknown): SaveProjectResult {
  if (!isStudioEnabled()) {
    return {
      success: false,
      status: 404,
      error: "Portfolio Studio is disabled or not in development mode with PORTFOLIO_STUDIO=1",
    };
  }

  try {
    let mode: "create" | "update" = "update";
    let originalSlug: string | undefined;
    let rawProject: unknown = payload;

    if (
      typeof payload === "object" &&
      payload !== null &&
      "project" in payload
    ) {
      const p = payload as SaveProjectPayload;
      rawProject = p.project;
      mode = p.mode || (p.originalSlug ? "update" : "create");
      originalSlug = p.originalSlug;
    }

    const project = ProjectSchema.parse(rawProject);
    const safeSlug = sanitizeSlug(project.slug);
    if (!safeSlug) {
      return { success: false, status: 400, error: "Invalid project slug" };
    }

    // Path traversal check
    if (safeSlug.includes("..") || safeSlug.includes("/") || safeSlug.includes("\\")) {
      return { success: false, status: 400, error: "Path traversal attempt detected" };
    }

    project.slug = safeSlug;
    project.media = deduplicateMedia(project.media || []);

    const targetFilePath = path.join(PROJECTS_DIR, `${safeSlug}.json`);

    if (mode === "create") {
      if (fs.existsSync(targetFilePath)) {
        return {
          success: false,
          status: 409,
          error: `Project with slug "${safeSlug}" already exists`,
        };
      }

      atomicWriteProjectJson(targetFilePath, project);
      return { success: true, status: 200, project };
    }

    // Mode: "update"
    const effectiveOriginalSlug = sanitizeSlug(originalSlug || safeSlug);
    const originalFilePath = path.join(PROJECTS_DIR, `${effectiveOriginalSlug}.json`);

    if (!fs.existsSync(originalFilePath) && !fs.existsSync(targetFilePath)) {
      // If neither original nor target exists in update mode, fallback to create
      atomicWriteProjectJson(targetFilePath, project);
      return { success: true, status: 200, project };
    }

    const fileToBackup = fs.existsSync(originalFilePath) ? originalFilePath : targetFilePath;
    createBackup(effectiveOriginalSlug, fileToBackup);

    // If slug changed
    if (effectiveOriginalSlug !== safeSlug) {
      if (fs.existsSync(targetFilePath)) {
        return {
          success: false,
          status: 409,
          error: `Cannot rename to "${safeSlug}": target slug already exists`,
        };
      }

      // Rename public images directory if exists
      const oldPublicDir = path.join(PUBLIC_PROJECTS_DIR, effectiveOriginalSlug);
      const newPublicDir = path.join(PUBLIC_PROJECTS_DIR, safeSlug);

      if (fs.existsSync(oldPublicDir)) {
        if (!fs.existsSync(path.dirname(newPublicDir))) {
          fs.mkdirSync(path.dirname(newPublicDir), { recursive: true });
        }
        fs.renameSync(oldPublicDir, newPublicDir);
      }

      // Update media paths in project object
      project.media = project.media.map((item) => {
        const oldPrefix = `/projects/${effectiveOriginalSlug}/`;
        const newPrefix = `/projects/${safeSlug}/`;
        if (item.src.startsWith(oldPrefix)) {
          return {
            ...item,
            src: item.src.replace(oldPrefix, newPrefix),
          };
        }
        return item;
      });

      // Write new JSON file atomically
      atomicWriteProjectJson(targetFilePath, project);

      // Remove old JSON file
      if (fs.existsSync(originalFilePath)) {
        fs.unlinkSync(originalFilePath);
      }
    } else {
      // Write JSON file atomically
      atomicWriteProjectJson(targetFilePath, project);
    }

    return { success: true, status: 200, project };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, status: 400, error: message };
  }
}
