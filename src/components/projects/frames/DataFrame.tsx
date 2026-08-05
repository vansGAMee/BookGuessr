"use client";

import React from "react";

interface DataFrameProps {
  title?: string;
  children: React.ReactNode;
  isSourceLayer?: boolean;
}

export const DataFrame: React.FC<DataFrameProps> = ({
  title = "ANALYTICS SURFACE",
  children,
  isSourceLayer = false,
}) => {
  return (
    <div
      className={`rounded-xl border overflow-hidden shadow-2xl transition-all duration-300 ${
        isSourceLayer
          ? "border-blue-500/40 bg-[#0B0D10] text-[#EDF1F7]"
          : "border-neutral-300 dark:border-neutral-800 bg-neutral-950 text-neutral-100"
      }`}
    >
      {/* Analytics Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800 bg-neutral-900/80 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold tracking-wider">{title}</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-neutral-400">
          <span>LATENCY: 12ms</span>
          <span>DATA_MODE: LIVE</span>
        </div>
      </div>

      {/* Surface Canvas */}
      <div className="relative min-h-[360px] md:min-h-[440px] flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};
