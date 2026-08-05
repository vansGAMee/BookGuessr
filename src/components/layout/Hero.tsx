"use client";

import React from "react";
import { useXRay } from "../experience/XRayContext";
import { Project } from "@/lib/projects/schema";
import { ProjectFilm } from "./ProjectFilm";
import { ArrowDown, Send } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";

interface HeroProps {
  projects: Project[];
}

export const Hero: React.FC<HeroProps> = ({ projects }) => {
  const { lang } = useXRay();

  return (
    <section className="relative w-full pt-28 pb-16 px-6 md:px-12 flex flex-col justify-between overflow-hidden border-b border-neutral-200 dark:border-neutral-800">
      {/* Main Editorial Text & CTA */}
      <div className="relative z-10 max-w-7xl mx-auto w-full space-y-8">
        <div className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-blue-600/10 border border-blue-600/30 text-blue-600 dark:text-blue-400">
          VANSGAMEE // BEAUTIFUL OUTSIDE, TECHNICAL INSIDE
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight font-sans text-neutral-900 dark:text-neutral-50 leading-[0.95]">
          {lang === "ru" ? "ИВАН КУЛЬКИН" : "IVAN KULKIN"}
        </h1>

        <p className="text-xl sm:text-2xl md:text-3xl font-medium text-neutral-700 dark:text-neutral-300 max-w-3xl leading-snug font-sans">
          {lang === "ru" ? (
            <>
              Собираю веб-продукты, <br className="hidden sm:inline" />
              инструменты для данных <br className="hidden sm:inline" />и
              офлайн-приложения.
            </>
          ) : (
            <>
              I BUILD WEB PRODUCTS, <br className="hidden sm:inline" />
              DATA TOOLS <br className="hidden sm:inline" />
              AND OFFLINE APPLICATIONS.
            </>
          )}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <a
            href="#work"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg hover:shadow-blue-500/25 active:scale-97"
          >
            <span>{lang === "ru" ? "Смотреть проекты" : "View Projects"}</span>
            <ArrowDown className="w-4 h-4" />
          </a>

          <a
            href="https://github.com/vansGAMee"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 text-neutral-900 dark:text-neutral-100 font-semibold text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all backdrop-blur-sm active:scale-97"
          >
            <GithubIcon className="w-4 h-4" />
            <span>GitHub</span>
          </a>

          <a
            href="https://t.me/Ivancoolstudio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 text-neutral-900 dark:text-neutral-100 font-semibold text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all backdrop-blur-sm active:scale-97"
          >
            <Send className="w-4 h-4 text-blue-500" />
            <span>{lang === "ru" ? "Написать в Telegram" : "Telegram"}</span>
          </a>
        </div>

        {/* Core Feature: Project Film Strip */}
        <div className="pt-6">
          <ProjectFilm projects={projects} />
        </div>
      </div>

      {/* Footer Indicator */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between text-xs font-mono text-neutral-500 pt-8">
        <span>LOC: RUSSIA</span>
        <span className="hidden sm:inline">STACK: NEXT.JS / TS / KOTLIN / RUST</span>
        <span>SCROLL FOR DETAILS ↓</span>
      </div>
    </section>
  );
};
