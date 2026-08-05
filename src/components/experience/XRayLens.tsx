"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { useXRay } from "./XRayContext";

export const XRayLens: React.FC = () => {
  const { mode, toggleMode, lang, isTouchDevice, lensRadius } = useXRay();
  const prefersReducedMotion = useReducedMotion();
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const lensRef = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(-1000);
  const rawY = useMotionValue(-1000);

  const springConfig = { stiffness: 450, damping: 32 };
  const smoothX = useSpring(rawX, springConfig);
  const smoothY = useSpring(rawY, springConfig);

  useEffect(() => {
    if (isTouchDevice || prefersReducedMotion) return;

    const handlePointerMove = (e: PointerEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);

      // Set CSS custom properties on document body for CSS clip-path mask
      document.documentElement.style.setProperty("--lens-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--lens-y", `${e.clientY}px`);

      if (!isVisible) setIsVisible(true);
      if (!hasInteracted) setHasInteracted(true);
    };

    const handlePointerLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [isTouchDevice, prefersReducedMotion, rawX, rawY, isVisible, hasInteracted]);

  useEffect(() => {
    document.documentElement.style.setProperty("--lens-radius", `${mode === "source" ? 2500 : lensRadius}px`);
  }, [mode, lensRadius]);

  if (isTouchDevice || prefersReducedMotion) return null;

  return (
    <>
      {/* Short initial hint toast until first move */}
      {!hasInteracted && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none bg-neutral-900/90 text-neutral-100 text-xs font-mono px-4 py-2 rounded-full border border-neutral-700 shadow-xl backdrop-blur-md animate-pulse">
          {lang === "ru" ? "ДВИГАЙТЕ КУРСОР, ЧТОБЫ УВИДЕТЬ ВНУТРИ" : "MOVE TO SEE BENEATH"}
        </div>
      )}

      {/* Optical Cursor Lens Frame */}
      {mode === "showcase" && (
        <motion.div
          ref={lensRef}
          style={{
            x: smoothX,
            y: smoothY,
            opacity: isVisible ? 1 : 0,
          }}
          onClick={toggleMode}
          className="fixed top-0 left-0 -ml-[100px] -mt-[100px] w-[200px] h-[200px] rounded-full pointer-events-none z-40 cursor-pointer transition-opacity duration-300 border border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.15)] ring-1 ring-white/20 backdrop-brightness-110"
        >
          {/* Subtle Chromatic Ring & Coordinate Indicator */}
          <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-spin-slow pointer-events-none" />
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-blue-400/90 tracking-widest uppercase bg-black/60 px-2 py-0.5 rounded-full border border-blue-500/30">
            X-RAY // SOURCE
          </div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[8px] font-mono text-neutral-400 bg-neutral-950/80 px-2 py-0.5 rounded">
            CLICK TO EXPAND
          </div>
        </motion.div>
      )}
    </>
  );
};
