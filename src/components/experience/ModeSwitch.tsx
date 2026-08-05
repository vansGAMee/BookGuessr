"use client";

import React from "react";
import { useXRay } from "./XRayContext";

export const ModeSwitch: React.FC = () => {
  const { mode, toggleMode, lang, toggleLang } = useXRay();

  return (
    <div className="flex items-center gap-3 text-xs font-mono">
      {/* SHOWCASE / SOURCE Toggle */}
      <button
        onClick={toggleMode}
        className="relative flex items-center p-1 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Toggle Showcase or Source display mode"
      >
        <span
          className={`px-3 py-1 rounded-full transition-all duration-300 ${
            mode === "showcase"
              ? "bg-neutral-900 text-neutral-50 shadow-sm font-semibold"
              : "text-neutral-600 dark:text-neutral-400"
          }`}
        >
          SHOWCASE
        </span>
        <span
          className={`px-3 py-1 rounded-full transition-all duration-300 ${
            mode === "source"
              ? "bg-blue-600 text-white shadow-sm font-semibold"
              : "text-neutral-600 dark:text-neutral-400"
          }`}
        >
          SOURCE
        </span>
      </button>

      {/* RU / EN Language Toggle */}
      <button
        onClick={toggleLang}
        className="px-2.5 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
        aria-label="Switch language"
      >
        {lang === "ru" ? "RU" : "EN"}
      </button>
    </div>
  );
};
