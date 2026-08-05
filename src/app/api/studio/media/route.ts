import { NextResponse } from "next/server";
import {
  isStudioEnabled,
  sanitizeSlug,
  generateSafeFileName,
  toPublicMediaPath,
} from "@/lib/projects/writer";
import fs from "fs";
import path from "path";

const PUBLIC_PROJECTS_DIR = path.join(process.cwd(), "public", "projects");
const ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/avif",
]);

export async function POST(req: Request) {
  if (!isStudioEnabled()) {
    return new NextResponse("Not Found", { status: 404 });
  }

  try {
    const formData = await req.formData();
    const slug = formData.get("slug") as string;
    const file = formData.get("file") as File;

    if (!slug || !file) {
      return NextResponse.json({ success: false, error: "Missing slug or file" }, { status: 400 });
    }

    const safeSlug = sanitizeSlug(slug);
    if (!safeSlug) {
      return NextResponse.json({ success: false, error: "Invalid slug" }, { status: 400 });
    }

    // Path traversal prevention
    if (safeSlug.includes("..") || safeSlug.includes("/") || safeSlug.includes("\\")) {
      return NextResponse.json({ success: false, error: "Invalid slug path" }, { status: 400 });
    }

    const extMatch = file.name.match(/\.(png|jpe?g|webp|avif)$/i);
    const isValidExt = Boolean(extMatch);
    const isValidMime = ALLOWED_MIME_TYPES.has(file.type);

    if (!isValidExt && !isValidMime) {
      return NextResponse.json(
        { success: false, error: "Unsupported image format. Allowed: PNG, JPG, WEBP, AVIF" },
        { status: 400 }
      );
    }

    const fileName = generateSafeFileName(safeSlug, file.name, file.type);
    const targetDir = path.join(PUBLIC_PROJECTS_DIR, safeSlug);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const targetPath = path.join(targetDir, fileName);
    const bytes = await file.arrayBuffer();
    fs.writeFileSync(targetPath, Buffer.from(bytes));

    const publicUrl = toPublicMediaPath(safeSlug, fileName);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      src: publicUrl,
      fileName,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
