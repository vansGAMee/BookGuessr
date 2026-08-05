"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Project } from "@/lib/projects/schema";
import { useXRay } from "../experience/XRayContext";
import { TechnicalCover } from "./frames/TechnicalCover";
import { ProjectFingerprint } from "./ProjectFingerprint";
import { ExternalLink, Terminal, CheckCircle2, AlertCircle } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";

interface ProjectSourceLayerProps {
  project: Project;
}

export const ProjectSourceLayer: React.FC<ProjectSourceLayerProps> = ({ project }) => {
  const { lang } = useXRay();

  const title = project.title[lang];
  const kicker = project.kicker[lang];

  const facts = project.proof?.facts?.[lang] || [];
  const limitations = project.proof?.limitations?.[lang] || [];

  return (
    <div className="w-full min-h-[80vh] py-12 md:py-20 px-6 md:px-12 bg-[#0B0D10] text-[#EDF1F7] flex flex-col justify-center border-b border-blue-500/20 font-mono relative overflow-hidden">
      {/* Background Technical Grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        {/* Left Blueprint Metadata Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs text-blue-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                SRC_0{project.order} {"// "} {kicker}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-blue-950/80 border border-blue-500/40 text-blue-300 font-bold uppercase">
                {project.status}
              </span>
            </div>
            <ProjectFingerprint project={project} isSourceLayer={true} className="w-14 h-14" />
          </div>

          <h2 className="text-3xl md:text-5xl font-bold tracking-tight font-sans text-white leading-tight">
            {title}
          </h2>

          {/* Stack Tags */}
          <div className="space-y-2">
            <span className="text-[11px] text-neutral-400 uppercase tracking-widest">TECH_STACK:</span>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded bg-[#12151B] border border-blue-500/30 text-blue-300 text-xs font-semibold"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Verified Facts & Architectural Constraints */}
          <div className="space-y-3 pt-2 text-xs">
            <span className="text-[11px] text-neutral-400 uppercase tracking-widest">VERIFIED_PROOF:</span>
            <ul className="space-y-2">
              {facts.map((fact, idx) => (
                <li key={idx} className="flex items-start gap-2 text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{fact}</span>
                </li>
              ))}
              {limitations.map((lim, idx) => (
                <li key={idx} className="flex items-start gap-2 text-amber-300">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{lim}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            {project.liveUrl && project.showLive !== false && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)] active:scale-97"
              >
                <span>EXECUTE_LIVE</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded border border-blue-500/40 bg-[#12151B] text-blue-300 hover:bg-[#1A1F29] text-xs transition-colors active:scale-97"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>INSPECT_REPO</span>
              </a>
            )}

            <Link
              href={`/projects/${project.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors ml-auto md:ml-0"
            >
              <span>{lang === "ru" ? "ОТКРЫТЬ СТРАНИЦУ" : "VIEW PAGE"}</span>
            </Link>
          </div>
        </div>

        {/* Right Blueprint Technical Frame */}
        <div className="lg:col-span-7 w-full">
          {project.media && project.media[0] ? (
            <div className="relative rounded-xl border border-blue-500/40 overflow-hidden bg-[#12151B] p-2">
              <div className="relative w-full h-[320px] md:h-[420px] rounded-lg overflow-hidden opacity-90 grayscale brightness-90 contrast-125">
                <Image
                  src={project.media[0].src}
                  alt={project.media[0].alt[lang]}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-blue-950/40 mix-blend-multiply" />
              </div>
              <div className="p-3 text-[11px] text-blue-400 flex items-center justify-between border-t border-blue-500/20 bg-[#0B0D10]">
                <span>ALT: {project.media[0].alt[lang]}</span>
                <span>RES: OPTIMIZED</span>
              </div>
            </div>
          ) : (
            <TechnicalCover project={project} isSourceLayer={true} />
          )}
        </div>
      </div>
    </div>
  );
};
