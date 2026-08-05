"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Project, ProjectStatus, ProjectPresentation, ProjectMedia } from "@/lib/projects/schema";
import { ProjectStage } from "@/components/projects/ProjectStage";
import { XRayProvider } from "@/components/experience/XRayContext";
import { Save, Plus, Upload, Check, AlertCircle, Trash2 } from "lucide-react";

interface StudioClientProps {
  initialProjects: Project[];
}

export const StudioClient: React.FC<StudioClientProps> = ({ initialProjects }) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedSlug, setSelectedSlug] = useState<string>(
    initialProjects[0]?.slug || ""
  );
  const [originalSlug, setOriginalSlug] = useState<string>(
    initialProjects[0]?.slug || ""
  );
  const [isEditing, setIsEditing] = useState<boolean>(
    initialProjects.length > 0
  );

  const selectedProject =
    projects.find((p) => p.slug === selectedSlug) || {
      slug: "new-project",
      title: { ru: "Новый проект", en: "New Project" },
      kicker: { ru: "Веб-инструмент", en: "Web Tool" },
      summary: { ru: "Описание проекта", en: "Project summary" },
      description: { ru: "Подробное описание", en: "Detailed description" },
      status: "live",
      presentation: "browser",
      order: projects.length + 1,
      featured: true,
      published: true,
      showLive: true,
      liveUrl: "",
      repoUrl: "",
      stack: ["React", "TypeScript"],
      media: [],
      proof: {
        facts: { ru: ["Подтвержденная интеграция"], en: ["Verified integration"] },
      },
    };

  const [formData, setFormData] = useState<Project>(selectedProject);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleSelectProject = (slug: string) => {
    setSelectedSlug(slug);
    setOriginalSlug(slug);
    setIsEditing(true);
    const p = projects.find((item) => item.slug === slug);
    if (p) {
      setFormData(structuredClone(p));
    }
  };

  const handleCreateNew = () => {
    const newSlug = `project-${Date.now()}`;
    const newProj: Project = {
      slug: newSlug,
      title: { ru: "Новый Проект", en: "New Project" },
      kicker: { ru: "Инструмент", en: "Tool" },
      summary: { ru: "Краткое описание", en: "Short summary" },
      description: { ru: "Полное описание", en: "Full description" },
      status: "in-development",
      presentation: "browser",
      order: projects.length + 1,
      featured: true,
      published: true,
      showLive: false,
      liveUrl: "",
      repoUrl: "",
      stack: ["Next.js", "TypeScript"],
      media: [],
      proof: {
        facts: { ru: ["Разработка активна"], en: ["Development active"] },
      },
    };
    setSelectedSlug(newSlug);
    setOriginalSlug(newSlug);
    setIsEditing(false);
    setFormData(newProj);
    setSelectedFiles([]);
  };

  const handleRemoveMedia = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      media: prev.media.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatusMessage(null);

    let uploadedMediaItems: ProjectMedia[] = [];

    // Step 1: Upload any pending selected files
    if (selectedFiles.length > 0) {
      setIsUploading(true);
      const successfulUploads: ProjectMedia[] = [];
      const failedFiles: string[] = [];

      for (const file of selectedFiles) {
        try {
          const uploadData = new FormData();
          uploadData.append("slug", formData.slug);
          uploadData.append("file", file);

          const res = await fetch("/api/studio/media", {
            method: "POST",
            body: uploadData,
          });

          const json = await res.json();
          if (res.ok && json.success && (json.src || json.url)) {
            const publicPath = (json.src || json.url).replaceAll("\\", "/");
            successfulUploads.push({
              type: "image",
              src: publicPath,
              alt: {
                ru: `Скриншот ${file.name}`,
                en: `Screenshot ${file.name}`,
              },
            });
          } else {
            failedFiles.push(file.name);
          }
        } catch {
          failedFiles.push(file.name);
        }
      }

      setIsUploading(false);

      if (failedFiles.length > 0) {
        setIsSaving(false);
        setStatusMessage({
          type: "error",
          text: `Failed to upload: ${failedFiles.join(", ")}. Save aborted. Please retry.`,
        });
        return;
      }

      uploadedMediaItems = successfulUploads;
    }

    // Deduplicate and merge media without dropping existing ones
    const seenSrcs = new Set<string>();
    const mergedMedia: ProjectMedia[] = [];

    for (const m of [...formData.media, ...uploadedMediaItems]) {
      if (!m.src) continue;
      const normalized = m.src.replaceAll("\\", "/").trim();
      if (!seenSrcs.has(normalized)) {
        seenSrcs.add(normalized);
        mergedMedia.push({ ...m, src: normalized });
      }
    }

    const payload = {
      mode: isEditing ? "update" : "create",
      originalSlug: isEditing ? originalSlug : undefined,
      project: {
        ...formData,
        media: mergedMedia,
      },
    };

    try {
      const res = await fetch("/api/studio/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setStatusMessage({
          type: "error",
          text: json.error || `Failed to save project (HTTP ${res.status})`,
        });
      } else {
        const savedProject: Project = json.project;
        setStatusMessage({ type: "success", text: "Project saved successfully!" });
        setSelectedFiles([]);

        setProjects((prev) => {
          const idx = prev.findIndex((p) => p.slug === originalSlug || p.slug === savedProject.slug);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = savedProject;
            return next;
          }
          return [...prev, savedProject];
        });

        setSelectedSlug(savedProject.slug);
        setOriginalSlug(savedProject.slug);
        setIsEditing(true);
        setFormData(savedProject);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setStatusMessage({ type: "error", text: message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <XRayProvider>
      <div className="min-h-screen bg-neutral-950 text-neutral-100 font-mono flex flex-col">
        {/* Header */}
        <header className="px-6 h-16 border-b border-neutral-800 flex items-center justify-between bg-neutral-900">
          <div className="flex items-center gap-3 font-bold text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>PORTFOLIO STUDIO // LOCAL EDITOR</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCreateNew}
              className="px-3 py-1.5 rounded border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Project</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || isUploading}
              className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? "Saving..." : isUploading ? "Uploading..." : "Save Project"}</span>
            </button>
          </div>
        </header>

        {/* Status Toast Notification */}
        {statusMessage && (
          <div
            className={`px-6 py-2.5 text-xs font-semibold flex items-center gap-2 ${
              statusMessage.type === "success"
                ? "bg-emerald-950 text-emerald-300 border-b border-emerald-800"
                : "bg-red-950 text-red-300 border-b border-red-800"
            }`}
          >
            {statusMessage.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Workspace Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left Project Selector */}
          <div className="lg:col-span-2 border-r border-neutral-800 bg-neutral-900/50 p-4 space-y-2">
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">PROJECTS</span>
            <div className="space-y-1">
              {projects.map((p) => (
                <button
                  key={p.slug}
                  onClick={() => handleSelectProject(p.slug)}
                  className={`w-full text-left px-3 py-2 rounded text-xs truncate transition-colors ${
                    selectedSlug === p.slug
                      ? "bg-blue-600 text-white font-bold"
                      : "hover:bg-neutral-800 text-neutral-400"
                  }`}
                >
                  0{p.order}. {p.title.en}
                </button>
              ))}
            </div>
          </div>

          {/* Center Editor Form */}
          <div className="lg:col-span-5 border-r border-neutral-800 p-6 overflow-y-auto max-h-[calc(100vh-64px)] space-y-6 text-xs">
            <div className="space-y-1">
              <label className="text-neutral-400 font-bold uppercase">SLUG:</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-neutral-400 font-bold uppercase">TITLE (RU):</label>
                <input
                  type="text"
                  value={formData.title.ru}
                  onChange={(e) =>
                    setFormData({ ...formData, title: { ...formData.title, ru: e.target.value } })
                  }
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-neutral-400 font-bold uppercase">TITLE (EN):</label>
                <input
                  type="text"
                  value={formData.title.en}
                  onChange={(e) =>
                    setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })
                  }
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-neutral-400 font-bold uppercase">STATUS:</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white"
                >
                  <option value="live">live</option>
                  <option value="in-development">in-development</option>
                  <option value="frontend-demo">frontend-demo</option>
                  <option value="code-only">code-only</option>
                  <option value="archived">archived</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 font-bold uppercase">PRESENTATION:</label>
                <select
                  value={formData.presentation}
                  onChange={(e) => setFormData({ ...formData, presentation: e.target.value as ProjectPresentation })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white"
                >
                  <option value="browser">browser</option>
                  <option value="phone">phone</option>
                  <option value="data">data</option>
                  <option value="dashboard">dashboard</option>
                  <option value="code">code</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-neutral-400 font-bold uppercase">LIVE URL:</label>
                <input
                  type="text"
                  value={formData.liveUrl || ""}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-neutral-400 font-bold uppercase">REPO URL:</label>
                <input
                  type="text"
                  value={formData.repoUrl || ""}
                  onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showLive}
                  onChange={(e) => setFormData({ ...formData, showLive: e.target.checked })}
                  className="rounded border-neutral-700 bg-neutral-900"
                />
                <span>SHOW LIVE BUTTON</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-neutral-700 bg-neutral-900"
                />
                <span>FEATURED</span>
              </label>
            </div>

            {/* Media Items List & Upload Section */}
            <div className="space-y-3 pt-4 border-t border-neutral-800">
              <span className="text-neutral-400 font-bold uppercase block">
                PROJECT MEDIA ({formData.media.length}):
              </span>

              {formData.media.length > 0 && (
                <div className="space-y-2">
                  {formData.media.map((item, idx) => (
                    <div
                      key={item.src + idx}
                      className="p-3 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-between gap-3"
                    >
                      <div className="relative w-12 h-12 rounded overflow-hidden bg-black shrink-0">
                        <Image
                          src={item.src}
                          alt={item.alt.en}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 truncate">
                        <span className="text-[10px] text-blue-400 block truncate">{item.src}</span>
                        <span className="text-[9px] text-neutral-400 block truncate">{item.alt.en}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveMedia(idx)}
                        className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded transition-colors"
                        title="Delete image"
                        aria-label="Delete image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2">
                <label className="text-neutral-400 font-bold uppercase block mb-1">
                  ADD NEW SCREENSHOTS:
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,image/webp,image/avif"
                    onChange={(e) => {
                      if (e.target.files) {
                        setSelectedFiles(Array.from(e.target.files));
                      }
                    }}
                    className="text-xs text-neutral-400 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
                  />
                  <Upload className="w-4 h-4 text-neutral-500" />
                </div>
                {selectedFiles.length > 0 && (
                  <span className="text-[10px] text-blue-400 mt-1 block">
                    {selectedFiles.length} file(s) ready for upload on Save.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Live Stage Preview */}
          <div className="lg:col-span-5 p-6 bg-neutral-900 overflow-y-auto max-h-[calc(100vh-64px)] space-y-4">
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">LIVE STAGE PREVIEW</span>
            <div className="rounded-xl overflow-hidden border border-neutral-800">
              <ProjectStage project={formData} />
            </div>
          </div>
        </div>
      </div>
    </XRayProvider>
  );
};
