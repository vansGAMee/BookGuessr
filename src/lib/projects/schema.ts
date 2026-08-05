import { z } from "zod";

export const LocalizedTextSchema = z.object({
  ru: z.string(),
  en: z.string(),
});

export type LocalizedText = z.infer<typeof LocalizedTextSchema>;

export const LocalizedListSchema = z.object({
  ru: z.array(z.string()),
  en: z.array(z.string()),
});

export type LocalizedList = z.infer<typeof LocalizedListSchema>;

export const ProjectStatusSchema = z.enum([
  "live",
  "in-development",
  "frontend-demo",
  "code-only",
  "archived",
]);

export type ProjectStatus = z.infer<typeof ProjectStatusSchema>;

export const LiveModeSchema = z.enum([
  "full",
  "frontend-demo",
  "preview",
  "static",
]);

export type LiveMode = z.infer<typeof LiveModeSchema>;

export const ProjectPresentationSchema = z.enum([
  "browser",
  "phone",
  "data",
  "dashboard",
  "mixed",
  "code",
]);

export type ProjectPresentation = z.infer<typeof ProjectPresentationSchema>;

export const ProjectMediaSchema = z.object({
  type: z.enum(["image", "video"]),
  src: z.string(),
  alt: LocalizedTextSchema,
  poster: z.string().optional(),
  aspectRatio: z.string().optional(),
});

export type ProjectMedia = z.infer<typeof ProjectMediaSchema>;

export const ProjectProofSchema = z.object({
  facts: LocalizedListSchema,
  limitations: LocalizedListSchema.optional(),
});

export type ProjectProof = z.infer<typeof ProjectProofSchema>;

export const ProjectSchema = z.object({
  slug: z.string().min(1),
  title: LocalizedTextSchema,
  kicker: LocalizedTextSchema,
  summary: LocalizedTextSchema,
  description: LocalizedTextSchema,
  status: ProjectStatusSchema,
  presentation: ProjectPresentationSchema,
  year: z.number().optional(),
  order: z.number(),
  featured: z.boolean(),
  published: z.boolean(),
  showLive: z.boolean(),
  liveMode: LiveModeSchema.optional(),
  previewUrl: z.string().url().optional().or(z.literal("")),
  availabilityNote: LocalizedTextSchema.optional(),
  relatedProjects: z.array(z.string()).optional(),
  liveUrl: z.string().url().optional().or(z.literal("")),
  repoUrl: z.string().url().optional().or(z.literal("")),
  captureLive: z.boolean().optional(),
  stack: z.array(z.string()),
  role: LocalizedTextSchema.optional(),
  media: z.array(ProjectMediaSchema).default([]),
  proof: ProjectProofSchema,
  accent: z.string().optional(),
});

export type Project = z.infer<typeof ProjectSchema>;
