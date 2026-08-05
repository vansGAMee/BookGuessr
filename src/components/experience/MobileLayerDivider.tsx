"use client";

import React, { useState, useEffect, useRef } from "react";
import { useXRay } from "./XRayContext";

export const MobileLayerDivider: React.FC = () => {
  const { isTouchDevice, mode } = useXRay();
  const [splitPos, setSplitPos] = useState<number>(50); // percentage 0..100
  const isDragging = useRef(false);

  useEffect(() => {
    if (!isTouchDevice || mode === "source") {
      document.documentElement.style.setProperty("--mobile-split", "100%");
      return;
    }
    document.documentElement.style.setProperty("--mobile-split", `${splitPos}%`);
  }, [isTouchDevice, mode, splitPos]);

  if (!isTouchDevice || mode === "source") return null;

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging.current) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const width = window.innerWidth;
    const pct = Math.max(5, Math.min(95, (clientX / width) * 100));
    setSplitPos(pct);
  };

  return (
    <div
      tabIndex={0}
      role="slider"
      aria-label="Layer split position slider"
      aria-valuenow={Math.round(splitPos)}
      aria-valuemin={5}
      aria-valuemax={95}
      aria-valuetext={`${Math.round(splitPos)} percent showcase layer`}
      className="fixed top-0 bottom-0 z-30 pointer-events-auto touch-none"
      style={{ left: `${splitPos}%` }}
      onTouchStart={() => (isDragging.current = true)}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => (isDragging.current = false)}
      onMouseDown={() => (isDragging.current = true)}
      onMouseMove={handleTouchMove}
      onMouseUp={() => (isDragging.current = false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") setSplitPos((p) => Math.max(5, p - 5));
        if (e.key === "ArrowRight") setSplitPos((p) => Math.min(95, p + 5));
      }}
    >
      {/* Vertical divider line */}
      <div className="absolute top-0 bottom-0 -left-[1px] w-[2px] bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />

      {/* Touch Handle */}
      <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-12 rounded-full bg-neutral-900 border-2 border-blue-500 shadow-xl flex items-center justify-center text-blue-400 font-mono text-[10px] select-none">
        ↔
      </div>
    </div>
  );
};
