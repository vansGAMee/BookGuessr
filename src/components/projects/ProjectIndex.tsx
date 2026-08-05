"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Project } from "@/lib/projects/schema";
import { useXRay } from "../experience/XRayContext";
import { ProjectFingerprint } from "./ProjectFingerprint";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";

interface ProjectIndexProps {
  projects: Project[];
}

export const ProjectIndex: React.FC<ProjectIndexProps> = ({ projects }) => {
  const { lang, activeHoverSlug, setActiveHoverSlug, mode } = useXRay();
  const [activeSlug, setActiveSlug] = useState<string>(projects[0]?.slug || "");

  const hoveredProject =
    projects.find((p) => p.slug === (activeHoverSlug || activeSlug)) || projects[0];

  return (
    <section className="w-full py-20 px-6 md:px-12 border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs text-blue-600 font-bold uppercase tracking-widest">
              INDEX // ALL PUBLISHED WORK
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-sans mt-1">
              {lang === "ru" ? "Указатель проектов" : "Project Index"}
            </h2>
          </div>
          <p className="text-sm text-neutral-500 font-mono">
            {projects.length} {lang === "ru" ? "ОПУБЛИКОВАННЫХ КЕЙСА" : "PUBLISHED CASES"}
          </p>
        </div>

        {/* Index Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Table List Column */}
          <div className="lg:col-span-7 divide-y divide-neutral-200 dark:divide-neutral-800 border-y border-neutral-200 dark:border-neutral-800 font-mono text-xs md:text-sm">
            {projects.map((project) => {
              const isSelected = (activeHoverSlug || activeSlug) === project.slug;

              return (
                <div
                  key={project.slug}
                  onMouseEnter={() => {
                    setActiveHoverSlug(project.slug);
                    setActiveSlug(project.slug);
                  }}
                  onMouseLeave={() => setActiveHoverSlug(null)}
                  className={`py-5 px-3 md:px-6 transition-colors duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer ${
                    isSelected ? "bg-blue-600/10 dark:bg-blue-950/40" : "hover:bg-neutral-100 dark:hover:bg-neutral-900/60"
                  }`}
                >
                  {/* Title & Kicker */}
                  <div className="flex items-center gap-4 min-w-[200px]">
                    <span className="text-neutral-400 font-semibold">0{project.order}</span>
                    <div>
                      <Link
                        href={`/projects/${project.slug}`}
                        className="font-bold text-base font-sans hover:text-blue-600 transition-colors"
                      >
                        {project.title[lang]}
                      </Link>
                      <div className="text-xs text-neutral-500 font-mono mt-0.5">
                        {project.kicker[lang]}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <span className="px-2.5 py-1 rounded text-[10px] font-semibold uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700">
                      {project.status}
                    </span>
                  </div>

                  {/* Action Links */}
                  <div className="flex items-center gap-3">
                    {project.liveUrl && project.showLive !== false && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-600 dark:text-neutral-400 hover:text-blue-600 transition-colors p-1"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-600 dark:text-neutral-400 hover:text-blue-600 transition-colors p-1"
                        title="GitHub Repository"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}

                    <Link
                      href={`/projects/${project.slug}`}
                      className="p-1 text-neutral-800 dark:text-neutral-200 hover:text-blue-600 transition-colors"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Hover Quick Preview Column (Desktop) */}
          {hoveredProject && (
            <div className="hidden lg:flex lg:col-span-5 sticky top-24 flex-col p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900 text-white font-mono space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">
                  INDEX PREVIEW // 0{hoveredProject.order}
                </span>
                <ProjectFingerprint project={hoveredProject} isSourceLayer={mode === "source"} className="w-16 h-16" />
              </div>

              {/* Preview Image or Poster */}
              <div className="relative w-full h-52 rounded-xl overflow-hidden bg-black">
                {hoveredProject.media && hoveredProject.media[0] ? (
                  <Image
                    src={hoveredProject.media[0].src}
                    alt={hoveredProject.media[0].alt[lang]}
                    fill
                    className="object-cover object-top"
                    sizes="33vw"
                  />
                ) : (
                  <div className="w-full h-full p-4 flex flex-col justify-between bg-neutral-950 text-neutral-300">
                    <span className="text-[10px] text-blue-400">{"// "} ARCHITECTURE POSTER</span>
                    <span className="text-sm font-bold font-sans">{hoveredProject.title[lang]}</span>
                    <span className="text-[10px] text-neutral-500">STATUS: {hoveredProject.status}</span>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold font-sans">{hoveredProject.title[lang]}</h3>
                <p className="text-xs text-neutral-400 font-sans mt-1 leading-relaxed">
                  {hoveredProject.summary[lang]}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {hoveredProject.stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded text-[10px] bg-neutral-800 border border-neutral-700 text-neutral-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
