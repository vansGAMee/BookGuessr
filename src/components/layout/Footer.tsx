"use client";

import React from "react";
import { useXRay } from "../experience/XRayContext";

export const Footer: React.FC = () => {
  const { mode } = useXRay();

  return (
    <footer
      className={`w-full py-8 px-6 md:px-12 border-t font-mono text-xs transition-colors duration-300 ${
        mode === "source"
          ? "bg-[#0B0D10] border-blue-500/20 text-[#8A92A3]"
          : "bg-[#F8F7F4] border-neutral-200 text-neutral-500"
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          © {new Date().getFullYear()} IVAN KULKIN (vansGAMee). ALL RIGHTS RESERVED.
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>SYSTEM: UNDER THE SURFACE</span>
          <span>MODE: {mode.toUpperCase()}</span>
        </div>
      </div>
    </footer>
  );
};
