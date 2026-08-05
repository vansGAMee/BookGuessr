"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Project } from "@/lib/projects/schema";
import { useXRay } from "../experience/XRayContext";
import { ProjectFingerprint } from "../projects/ProjectFingerprint";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

interface ProjectFilmProps {
  projects: Project[];
}

export const ProjectFilm: React.FC<ProjectFilmProps> = ({ projects }) => {
  const { lang, mode } = useXRay();
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  const activeProject = projects[activeIndex] || projects[0];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full my-8 font-mono select-none">
      {/* Editorial Title & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 px-2">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
            PROJECT FILM // 0{activeIndex + 1} OF 0{projects.length}
          </span>
        </div>

        {/* Prev / Next Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-transform active:scale-95"
            aria-label="Previous Project in Film"
          >
            <ChevronLeft className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-transform active:scale-95"
            aria-label="Next Project in Film"
          >
            <ChevronRight className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />
          </button>
        </div>
      </div>

      {/* Main Strip Container */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900/90 p-4 md:p-8 backdrop-blur-md shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Active Frame Presentation */}
          <div className="lg:col-span-8 relative min-h-[320px] md:min-h-[420px] rounded-xl overflow-hidden bg-black flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject.slug}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.04 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="relative w-full h-full min-h-[320px] md:min-h-[420px]"
              >
                {activeProject.media && activeProject.media[0] ? (
                  <Image
                    src={activeProject.media[0].src}
                    alt={activeProject.media[0].alt[lang]}
                    fill
                    priority
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                ) : (
                  <div className="w-full h-full p-8 flex flex-col justify-between bg-neutral-900 text-white font-mono">
                    <span className="text-xs text-blue-400">{"// "} SPECIFICATION POSTER</span>
                    <h3 className="text-2xl font-bold font-sans">{activeProject.title[lang]}</h3>
                    <p className="text-xs text-neutral-400">{activeProject.summary[lang]}</p>
                    <span className="text-[10px] text-neutral-500">STATUS: {activeProject.status}</span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar Active Project Details & Fingerprint */}
          <div className="lg:col-span-4 space-y-6 text-white">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded text-[10px] bg-blue-950 border border-blue-500/40 text-blue-300 font-bold uppercase">
                {activeProject.status}
              </span>
              <ProjectFingerprint project={activeProject} isSourceLayer={mode === "source"} className="w-20 h-20" />
            </div>

            <div>
              <span className="text-[11px] text-neutral-400 uppercase tracking-widest font-mono">
                {activeProject.kicker[lang]}
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold font-sans mt-1 text-white">
                {activeProject.title[lang]}
              </h3>
              <p className="text-xs text-neutral-300 font-sans mt-2 leading-relaxed">
                {activeProject.summary[lang]}
              </p>
            </div>

            {/* Stack Badges */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {activeProject.stack.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded text-[10px] bg-neutral-800 border border-neutral-700 text-neutral-300"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Link to Stage Section */}
            <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
              <a
                href={`#${activeProject.slug}`}
                className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
              >
                <span>{lang === "ru" ? "ПЕРЕЙТИ К КЕЙСУ" : "VIEW STAGE SECTION"}</span>
                <ChevronRight className="w-4 h-4" />
              </a>

              <Link
                href={`/projects/${activeProject.slug}`}
                className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
                aria-label="Open Full Project Page"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
