"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type DisplayMode = "showcase" | "source";
export type Language = "ru" | "en";

interface XRayContextType {
  mode: DisplayMode;
  setMode: (mode: DisplayMode) => void;
  toggleMode: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  lensRadius: number;
  setLensRadius: (r: number) => void;
  isTouchDevice: boolean;
  activeHoverSlug: string | null;
  setActiveHoverSlug: (slug: string | null) => void;
  activeFunnelStage: string | null;
  setActiveFunnelStage: (stage: string | null) => void;
}

const XRayContext = createContext<XRayContextType | undefined>(undefined);

export const XRayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<DisplayMode>("showcase");
  const [lang, setLang] = useState<Language>("ru");
  const [lensRadius, setLensRadius] = useState<number>(180);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const [activeHoverSlug, setActiveHoverSlug] = useState<string | null>(null);
  const [activeFunnelStage, setActiveFunnelStage] = useState<string | null>(null);

  useEffect(() => {
    const checkTouch = () => {
      const isTouch = window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
      setIsTouchDevice(isTouch);
    };
    checkTouch();
    window.addEventListener("resize", checkTouch);
    return () => window.removeEventListener("resize", checkTouch);
  }, []);

  const toggleMode = () => {
    setMode((prev) => (prev === "showcase" ? "source" : "showcase"));
  };

  const toggleLang = () => {
    setLang((prev) => (prev === "ru" ? "en" : "ru"));
  };

  return (
    <XRayContext.Provider
      value={{
        mode,
        setMode,
        toggleMode,
        lang,
        setLang,
        toggleLang,
        lensRadius,
        setLensRadius,
        isTouchDevice,
        activeHoverSlug,
        setActiveHoverSlug,
        activeFunnelStage,
        setActiveFunnelStage,
      }}
    >
      {children}
    </XRayContext.Provider>
  );
};

export const useXRay = () => {
  const ctx = useContext(XRayContext);
  if (!ctx) {
    throw new Error("useXRay must be used within an XRayProvider");
  }
  return ctx;
};
