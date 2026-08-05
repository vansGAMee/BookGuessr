"use client";

import React from "react";

interface BrowserFrameProps {
  url?: string;
  children: React.ReactNode;
  isSourceLayer?: boolean;
}

export const BrowserFrame: React.FC<BrowserFrameProps> = ({
  url = "https://vansgamee.github.io/",
  children,
  isSourceLayer = false,
}) => {
  return (
    <div
      className={`rounded-xl border overflow-hidden transition-all duration-300 shadow-2xl ${
        isSourceLayer
          ? "border-blue-500/30 bg-[#0B0D10] text-[#EDF1F7]"
          : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900"
      }`}
    >
      {/* Window Controls & Address Bar */}
      <div
        className={`flex items-center gap-3 px-4 py-2.5 border-b text-xs font-mono select-none ${
          isSourceLayer
            ? "border-blue-500/20 bg-[#12151B]"
            : "border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950"
        }`}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
        </div>
        <div
          className={`flex-1 mx-2 px-3 py-1 rounded text-center truncate ${
            isSourceLayer
              ? "bg-[#0B0D10] text-blue-400 border border-blue-500/30"
              : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800"
          }`}
        >
          {url}
        </div>
        <div className="text-[10px] text-neutral-400">WEB</div>
      </div>

      {/* Main Viewport Content */}
      <div className="relative min-h-[320px] md:min-h-[420px] overflow-hidden flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};
