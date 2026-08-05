"use client";

import React from "react";
import { Project } from "@/lib/projects/schema";

interface TechnicalCoverProps {
  project: Project;
  isSourceLayer?: boolean;
}

export const TechnicalCover: React.FC<TechnicalCoverProps> = ({ project, isSourceLayer = false }) => {
  return (
    <div
      className={`relative w-full h-full min-h-[320px] p-6 md:p-10 flex flex-col justify-between overflow-hidden rounded-lg font-mono ${
        isSourceLayer
          ? "bg-[#0B0D10] text-[#EDF1F7] border border-blue-500/30"
          : "bg-neutral-900 text-neutral-100 border border-neutral-800"
      }`}
    >
      {/* Blueprint Grid Lines Pattern */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Header Info */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-widest text-blue-400 uppercase">
            {"// "} SPECIFICATION &amp; ARCHITECTURE
          </span>
          <h3 className="text-xl md:text-2xl font-bold font-sans mt-1 text-white">
            {project.title.en}
          </h3>
        </div>
        <div className="px-3 py-1 rounded text-xs border border-blue-500/40 bg-blue-950/40 text-blue-300 font-semibold uppercase">
          {project.status}
        </div>
      </div>

      {/* Center Technical Blueprint Facts */}
      <div className="relative z-10 my-6 space-y-2 text-xs text-neutral-300">
        <p className="text-neutral-400 font-sans leading-relaxed">
          {project.summary.ru}
        </p>
        <div className="pt-2 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded text-[11px] bg-neutral-800 border border-neutral-700 text-neutral-200"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 flex items-center justify-between text-[11px] text-neutral-400 border-t border-neutral-800 pt-3">
        <span>SLUG: {project.slug}</span>
        <span>ORDER: #{project.order}</span>
      </div>
    </div>
  );
};
