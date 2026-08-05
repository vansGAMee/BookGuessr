import fs from "fs";
import path from "path";
import { Project, ProjectSchema } from "./schema";

const PROJECTS_DIR = path.join(process.cwd(), "src", "content", "projects");

export function getAllProjects(): Project[] {
  if (!fs.existsSync(PROJECTS_DIR)) {
    return [];
  }

  const files = fs.readdirSync(PROJECTS_DIR);
  const projects: Project[] = [];
  const seenSlugs = new Map<string, string>();

  for (const file of files) {
    if (!file.endsWith(".json")) continue;

    const filePath = path.join(PROJECTS_DIR, file);
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const rawData = JSON.parse(content);
      const project = ProjectSchema.parse(rawData);

      const previousFile = seenSlugs.get(project.slug);
      if (previousFile) {
        throw new Error(
          `Duplicate project slug "${project.slug}" in "${previousFile}" and "${file}"`
        );
      }

      seenSlugs.set(project.slug, file);
      projects.push(project);
    } catch (err) {
      if (err instanceof Error && err.message.includes("Duplicate project slug")) {
        throw err;
      }
      console.error(`Error loading project file ${file}:`, err);
    }
  }

  return projects.sort((a, b) => a.order - b.order);
}

export function getPublishedProjects(): Project[] {
  return getAllProjects().filter((p) => p.published !== false);
}

export function getProjectBySlug(slug: string): Project | undefined {
  const all = getAllProjects();
  return all.find((p) => p.slug === slug);
}

export interface FunnelStats {
  publishedCount: number;
  hasMediaCount: number;
  hasLiveCount: number;
  hasRepoCount: number;
  featuredCount: number;
}

export function getFunnelStats(projects: Project[] = getPublishedProjects()): FunnelStats {
  return {
    publishedCount: projects.length,
    hasMediaCount: projects.filter((p) => p.media && p.media.length > 0).length,
    hasLiveCount: projects.filter((p) => Boolean(p.liveUrl) && p.showLive !== false).length,
    hasRepoCount: projects.filter((p) => Boolean(p.repoUrl)).length,
    featuredCount: projects.filter((p) => p.featured).length,
  };
}
