"use client";

import React, { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Project } from "@/lib/projects/schema";

interface ProjectFingerprintProps {
  project: Project;
  isSourceLayer?: boolean;
  className?: string;
}

// Simple deterministic string hash to generate consistent seed numbers
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash);
}

export const ProjectFingerprint: React.FC<ProjectFingerprintProps> = ({
  project,
  isSourceLayer = false,
  className = "w-32 h-32",
}) => {
  const prefersReducedMotion = useReducedMotion();

  const { pathData, points, hashHex } = useMemo(() => {
    const seed = hashString(project.slug + (project.status || ""));
    const hashHex = seed.toString(16).padStart(6, "0").toUpperCase();
    const count = 6;
    const center = 64;
    const baseRadius = 40;

    const pointsArr: { x: number; y: number; label: string }[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i * 2 * Math.PI) / count - Math.PI / 2;
      const mod = ((seed >> (i * 4)) & 0xf) / 15; // 0..1
      const r = baseRadius * (0.6 + mod * 0.5);
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      const techLabel = project.stack[i % project.stack.length] || `P${i}`;
      pointsArr.push({ x, y, label: techLabel });
    }

    // Generate smooth cubic bezier SVG path connecting points
    let d = `M ${pointsArr[0].x.toFixed(1)} ${pointsArr[0].y.toFixed(1)}`;
    for (let i = 0; i < count; i++) {
      const p1 = pointsArr[i];
      const p2 = pointsArr[(i + 1) % count];
      const cx = (p1.x + p2.x) / 2 + Math.sin(i) * 6;
      const cy = (p1.y + p2.y) / 2 + Math.cos(i) * 6;
      d += ` Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }

    return { pathData: d, points: pointsArr, hashHex };
  }, [project.slug, project.status, project.stack]);

  return (
    <div className={`relative flex flex-col items-center justify-center font-mono ${className}`}>
      <svg
        viewBox="0 0 128 128"
        className="w-full h-full overflow-visible"
        fill="none"
        aria-label={`Deterministic fingerprint for ${project.title.en}`}
      >
        {/* Background Concentric Radar Rings */}
        <circle cx="64" cy="64" r="50" stroke={isSourceLayer ? "rgba(59,130,246,0.15)" : "rgba(0,0,0,0.06)"} strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="64" cy="64" r="30" stroke={isSourceLayer ? "rgba(59,130,246,0.15)" : "rgba(0,0,0,0.06)"} strokeWidth="1" />
        <line x1="64" y1="10" x2="64" y2="118" stroke={isSourceLayer ? "rgba(59,130,246,0.15)" : "rgba(0,0,0,0.06)"} strokeWidth="1" />
        <line x1="10" y1="64" x2="118" y2="64" stroke={isSourceLayer ? "rgba(59,130,246,0.15)" : "rgba(0,0,0,0.06)"} strokeWidth="1" />

        {/* Animated Signature Trajectory Path */}
        <motion.path
          d={pathData}
          stroke={isSourceLayer ? "#3B82F6" : "#121316"}
          strokeWidth={isSourceLayer ? "2" : "1.5"}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 1.2,
            ease: [0.23, 1, 0.32, 1],
          }}
        />

        {/* Coordinate Points & Labels */}
        {points.map((pt, idx) => (
          <g key={idx}>
            <circle
              cx={pt.x}
              cy={pt.y}
              r={isSourceLayer ? "2.5" : "2"}
              fill={isSourceLayer ? "#60A5FA" : "#121316"}
            />
            {isSourceLayer && (
              <text
                x={pt.x > 64 ? pt.x + 4 : pt.x - 4}
                y={pt.y > 64 ? pt.y + 8 : pt.y - 4}
                fill="#93C5FD"
                fontSize="6"
                fontFamily="monospace"
                textAnchor={pt.x > 64 ? "start" : "end"}
              >
                {pt.label}
              </text>
            )}
          </g>
        ))}
      </svg>

      <span className={`text-[9px] mt-1 tracking-widest ${isSourceLayer ? "text-blue-400" : "text-neutral-500"}`}>
        SIG#{hashHex}
      </span>
    </div>
  );
};
