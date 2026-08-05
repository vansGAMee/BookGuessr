import { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/projects/loader";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://vansgamee.github.io";
  const projects = getPublishedProjects();

  const projectUrls = projects.map((p) => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    ...projectUrls,
  ];
}
