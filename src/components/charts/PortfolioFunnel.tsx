"use client";

import React from "react";
import { FunnelStats } from "@/lib/projects/loader";
import { useXRay } from "../experience/XRayContext";

interface PortfolioFunnelProps {
  stats: FunnelStats;
}

export const PortfolioFunnel: React.FC<PortfolioFunnelProps> = ({ stats }) => {
  const { lang } = useXRay();

  const stages = [
    {
      id: "published",
      label: lang === "ru" ? "Опубликованные кейсы" : "Published Projects",
      count: stats.publishedCount,
    },
    {
      id: "media",
      label: lang === "ru" ? "С графическими материалами" : "With Screenshots & Media",
      count: stats.hasMediaCount,
    },
    {
      id: "live",
      label: lang === "ru" ? "С доступным Live-демо" : "With Active Live Demo",
      count: stats.hasLiveCount,
    },
    {
      id: "repo",
      label: lang === "ru" ? "Открытый репозиторий" : "With Public GitHub Repo",
      count: stats.hasRepoCount,
    },
    {
      id: "featured",
      label: lang === "ru" ? "Избранные работы" : "Featured Showcase Work",
      count: stats.featuredCount,
    },
  ];

  const maxCount = Math.max(...stages.map((s) => s.count), 1);

  return (
    <section className="w-full py-20 px-6 md:px-12 border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <span className="font-mono text-xs text-blue-600 font-bold uppercase tracking-widest">
            PORTFOLIO PIPELINE
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-sans mt-1">
            {lang === "ru" ? "Состояние проектов" : "Portfolio State Funnel"}
          </h2>
          <p className="text-xs text-neutral-500 font-mono mt-2 max-w-xl">
            {lang === "ru"
              ? "* Диаграмма показывает текущую инженерную готовность и доступность материалов в портфолио, а не бизнес-конверсию."
              : "* Chart reflects engineering readiness and published documentation artifacts, not marketing conversion metrics."}
          </p>
        </div>

        {/* Editorial Funnel Stage Bars */}
        <div className="space-y-4 pt-4">
          {stages.map((stage) => {
            const widthPct = Math.max(15, (stage.count / maxCount) * 100);

            return (
              <div key={stage.id} className="space-y-1 font-mono text-xs">
                <div className="flex justify-between items-center text-neutral-700 dark:text-neutral-300 font-medium">
                  <span>{stage.label}</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {stage.count} {lang === "ru" ? "проектов" : "projects"}
                  </span>
                </div>
                <div className="w-full h-8 bg-neutral-200 dark:bg-neutral-900 rounded-lg overflow-hidden p-1 border border-neutral-300 dark:border-neutral-800">
                  <div
                    className="h-full bg-blue-600 rounded-md transition-all duration-500 flex items-center justify-end pr-3 text-white text-[10px] font-bold"
                    style={{ width: `${widthPct}%` }}
                  >
                    {Math.round(widthPct)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
