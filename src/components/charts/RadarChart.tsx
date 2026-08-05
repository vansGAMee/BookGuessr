"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";

export interface RadarMetric {
  key: string;
  label: string;
  value: number; // 0..100
}

interface RadarChartProps {
  metrics: RadarMetric[];
  title?: string;
  isSourceLayer?: boolean;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  metrics,
  title = "PLAYER DNA // POSITIONAL DIAGNOSTICS",
  isSourceLayer = false,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const count = metrics.length;
  const center = 100;
  const maxRadius = 70;

  // Calculate polygon coordinates for metrics
  const points = metrics.map((m, idx) => {
    const angle = (idx * 2 * Math.PI) / count - Math.PI / 2;
    const r = (m.value / 100) * maxRadius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, angle, label: m.label, value: m.value };
  });

  const polygonPoints = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  // Concentric radar background grid levels (20%, 40%, 60%, 80%, 100%)
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <div
      className={`relative p-6 rounded-xl border font-mono text-xs shadow-xl ${
        isSourceLayer
          ? "bg-[#0B0D10] border-blue-500/30 text-[#EDF1F7]"
          : "bg-neutral-900 border-neutral-800 text-white"
      }`}
    >
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
        <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest">{title}</span>
        <span className="text-[10px] text-neutral-500">BKLIT_RADAR_V1</span>
      </div>

      <div className="relative w-full max-w-[320px] mx-auto aspect-square flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
          {/* Radar Radial Web Lines */}
          {levels.map((lvl) => {
            const levelPoints = metrics
              .map((_, idx) => {
                const angle = (idx * 2 * Math.PI) / count - Math.PI / 2;
                const r = lvl * maxRadius;
                return `${(center + r * Math.cos(angle)).toFixed(1)},${(center + r * Math.sin(angle)).toFixed(1)}`;
              })
              .join(" ");
            return (
              <polygon
                key={lvl}
                points={levelPoints}
                fill="none"
                stroke={isSourceLayer ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.08)"}
                strokeWidth="1"
                strokeDasharray={lvl === 1 ? "none" : "2 2"}
              />
            );
          })}

          {/* Radial Axis Rays */}
          {points.map((pt, idx) => {
            const endX = center + maxRadius * Math.cos(pt.angle);
            const endY = center + maxRadius * Math.sin(pt.angle);
            return (
              <line
                key={idx}
                x1={center}
                y1={center}
                x2={endX}
                y2={endY}
                stroke={isSourceLayer ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.1)"}
                strokeWidth="1"
              />
            );
          })}

          {/* Metric Polygon Area */}
          <motion.polygon
            points={polygonPoints}
            fill={isSourceLayer ? "rgba(59,130,246,0.25)" : "rgba(99,102,241,0.25)"}
            stroke={isSourceLayer ? "#3B82F6" : "#818CF8"}
            strokeWidth="2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: [0.23, 1, 0.32, 1] }}
          />

          {/* Metric Data Points & Labels */}
          {points.map((pt, idx) => (
            <g key={idx}>
              <circle cx={pt.x} cy={pt.y} r="3" fill={isSourceLayer ? "#60A5FA" : "#A5B4FC"} />
              <text
                x={pt.x > center ? pt.x + 6 : pt.x - 6}
                y={pt.y > center ? pt.y + 10 : pt.y - 6}
                fill={isSourceLayer ? "#93C5FD" : "#D1D5DB"}
                fontSize="8"
                textAnchor={pt.x > center ? "start" : "end"}
              >
                {pt.label}: {pt.value}%
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};
