"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Project } from "@/lib/projects/schema";
import { useXRay } from "../experience/XRayContext";
import { BrowserFrame } from "./frames/BrowserFrame";
import { PhoneFrame } from "./frames/PhoneFrame";
import { DataFrame } from "./frames/DataFrame";
import { TechnicalCover } from "./frames/TechnicalCover";
import { ProjectFingerprint } from "./ProjectFingerprint";
import { RadarChart } from "../charts/RadarChart";
import { ExternalLink, ArrowRight, AlertTriangle, FileText, CheckCircle } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";

interface ProjectShowcaseLayerProps {
  project: Project;
}

export const ProjectShowcaseLayer: React.FC<ProjectShowcaseLayerProps> = ({ project }) => {
  const { lang } = useXRay();

  const title = project.title[lang];
  const kicker = project.kicker[lang];
  const summary = project.summary[lang];

  const sampleRadarMetrics = [
    { key: "tactics", label: "Tactics", value: 84 },
    { key: "endgame", label: "Endgame", value: 76 },
    { key: "opening", label: "Opening", value: 88 },
    { key: "time", label: "Time Mgmt", value: 92 },
    { key: "positional", label: "Positioning", value: 80 },
  ];

  const renderFrame = () => {
    // Custom presentation for business-toolkit file processing scene
    if (project.slug === "business-toolkit") {
      return (
        <BrowserFrame url={project.liveUrl || "https://business-toolkit-alpha.vercel.app/"} isSourceLayer={false}>
          <div className="relative w-full h-full min-h-[360px] p-6 flex flex-col justify-between bg-neutral-900 text-white font-mono">
            <div className="flex items-center justify-between text-xs text-neutral-400 border-b border-neutral-800 pb-3">
              <span>FILE_PROCESSING_ENGINE // BATCH_MODE</span>
              <span className="text-emerald-400">100% CLIENT_SIDE</span>
            </div>

            {/* Interactive File Processing Graphic Scene */}
            <div className="my-6 grid grid-cols-3 gap-4 items-center text-center">
              <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950 flex flex-col items-center">
                <FileText className="w-8 h-8 text-blue-400 mb-2 animate-bounce" />
                <span className="text-[11px] font-bold">SOURCE_DATA.CSV</span>
                <span className="text-[9px] text-neutral-500">2.4 MB // 14,200 ROWS</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500 flex items-center justify-center text-blue-400 text-xs font-bold animate-pulse">
                  →
                </div>
                <span className="text-[9px] text-blue-400 mt-1">NO_SERVER_TRANSFER</span>
              </div>
              <div className="p-4 rounded-xl border border-emerald-500/40 bg-neutral-950 flex flex-col items-center">
                <CheckCircle className="w-8 h-8 text-emerald-400 mb-2" />
                <span className="text-[11px] font-bold text-emerald-300">CLEAN_REPORT.XLSX</span>
                <span className="text-[9px] text-neutral-500">OPTIMIZED & EXPORTED</span>
              </div>
            </div>

            <div className="text-[10px] text-neutral-500 border-t border-neutral-800 pt-3 flex justify-between">
              <span>MEMORY_USAGE: 38MB</span>
              <span>ZERO_DATA_TRANSMISSION</span>
            </div>
          </div>
        </BrowserFrame>
      );
    }

    // Custom presentation for MQ-Chess Profile Analyzer
    if (project.slug === "mq-chess-profile-analyzer") {
      return (
        <DataFrame title="MQ-CHESS PLAYER DNA RADAR" isSourceLayer={false}>
          <div className="w-full p-4 flex flex-col items-center justify-center">
            <RadarChart metrics={sampleRadarMetrics} isSourceLayer={false} />
          </div>
        </DataFrame>
      );
    }

    // Custom presentation for OfflineScanner with scan-line effect
    if (project.slug === "offline-scanner") {
      return (
        <PhoneFrame isSourceLayer={false}>
          <div className="relative w-full h-full min-h-[440px] bg-neutral-950 text-white font-mono p-6 flex flex-col justify-between overflow-hidden">
            {/* Animated Scan Line */}
            <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse shadow-[0_0_15px_rgba(168,85,247,0.8)] top-1/3" />
            <div className="flex items-center justify-between text-[11px] text-purple-400 border-b border-neutral-800 pb-2">
              <span>SCANNER_NATIVE // KOTLIN</span>
              <span>60 FPS</span>
            </div>
            <div className="my-auto space-y-3 text-center">
              <div className="inline-block p-4 rounded-2xl bg-neutral-900 border border-purple-500/40">
                <span className="text-2xl font-bold font-sans">CODE_39 // VERIFIED</span>
                <p className="text-[10px] text-neutral-400 mt-1">LOCAL_INDEX_MATCH: ITEM #8942</p>
              </div>
            </div>
            <div className="text-[10px] text-neutral-500 border-t border-neutral-800 pt-2 flex justify-between">
              <span>DECODER: RUST/JNI</span>
              <span>OFFLINE_FIRST</span>
            </div>
          </div>
        </PhoneFrame>
      );
    }

    const primaryMedia = project.media && project.media[0];

    if (!primaryMedia || !primaryMedia.src) {
      return <TechnicalCover project={project} isSourceLayer={false} />;
    }

    const imageElement = (
      <div className="relative w-full h-full min-h-[300px] md:min-h-[400px]">
        <Image
          src={primaryMedia.src}
          alt={primaryMedia.alt[lang]}
          fill
          className="object-cover object-top"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    );

    switch (project.presentation) {
      case "phone":
        return <PhoneFrame isSourceLayer={false}>{imageElement}</PhoneFrame>;
      case "data":
        return <DataFrame title={title} isSourceLayer={false}>{imageElement}</DataFrame>;
      case "dashboard":
      case "browser":
      default:
        return <BrowserFrame url={project.liveUrl || `https://github.com/vansGAMee/${project.slug}`} isSourceLayer={false}>{imageElement}</BrowserFrame>;
    }
  };

  return (
    <div className="w-full min-h-[80vh] py-12 md:py-20 px-6 md:px-12 bg-[#F8F7F4] text-[#121316] flex flex-col justify-center border-b border-neutral-200">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Editorial Text Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-neutral-500 font-bold uppercase tracking-widest">
                0{project.order} {"// "} {kicker}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-neutral-200 text-neutral-800">
                {project.status}
              </span>
            </div>
            <ProjectFingerprint project={project} isSourceLayer={false} className="w-14 h-14" />
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-sans text-neutral-900 leading-tight">
            {title}
          </h2>

          <p className="text-base md:text-lg text-neutral-600 leading-relaxed font-sans">
            {summary}
          </p>

          {/* Availability Note Callout */}
          {project.availabilityNote && (
            <div className="p-3 rounded-lg border border-amber-300/80 bg-amber-50 text-amber-900 font-mono text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{project.availabilityNote[lang]}</span>
            </div>
          )}

          {/* Related Project Link */}
          {project.relatedProjects && project.relatedProjects.length > 0 && (
            <div className="font-mono text-xs text-blue-600 font-semibold pt-1">
              <span>ENGINE → PERSONAL DATA VIEW: </span>
              <Link href={`#${project.relatedProjects[0]}`} className="underline hover:text-blue-800">
                {project.relatedProjects[0]}
              </Link>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {project.liveUrl && project.showLive !== false && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 text-white font-medium text-xs hover:bg-neutral-800 transition-all shadow-md active:scale-97"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-neutral-300 bg-white text-neutral-900 font-medium text-xs hover:bg-neutral-100 transition-all active:scale-97"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            )}

            <Link
              href={`/projects/${project.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-800 hover:text-blue-600 transition-colors ml-auto md:ml-0"
            >
              <span>{lang === "ru" ? "Детали проекта" : "Project Details"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Presentation Frame Column */}
        <div className="lg:col-span-7 w-full">
          {renderFrame()}
        </div>
      </div>
    </div>
  );
};
