"use client";

import React from "react";
import { Project } from "@/lib/projects/schema";
import { useXRay } from "../experience/XRayContext";
import { ProjectShowcaseLayer } from "./ProjectShowcaseLayer";
import { ProjectSourceLayer } from "./ProjectSourceLayer";

interface ProjectStageProps {
  project: Project;
}

export const ProjectStage: React.FC<ProjectStageProps> = ({ project }) => {
  const { mode, isTouchDevice } = useXRay();

  return (
    <div className="relative w-full overflow-hidden select-text" id={project.slug}>
      {/* Base SHOWCASE Layer */}
      <div className="w-full">
        <ProjectShowcaseLayer project={project} />
      </div>

      {/* Synchronized SOURCE Layer overlay */}
      <div
        className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300 ${
          mode === "source"
            ? "opacity-100 pointer-events-auto z-20"
            : "z-10"
        }`}
        style={
          mode === "source"
            ? undefined
            : isTouchDevice
            ? {
                clipPath: "inset(0 0 0 var(--mobile-split, 50%))",
              }
            : {
                clipPath:
                  "circle(var(--lens-radius, 180px) at var(--lens-x, -1000px) var(--lens-y, -1000px))",
              }
        }
      >
        <ProjectSourceLayer project={project} />
      </div>
    </div>
  );
};
