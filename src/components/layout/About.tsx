"use client";

import React from "react";
import { useXRay } from "../experience/XRayContext";

export const About: React.FC = () => {
  const { lang } = useXRay();

  const techGroups = [
    {
      category: lang === "ru" ? "FRONTEND & WEB" : "FRONTEND & WEB",
      items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vite", "Motion"],
    },
    {
      category: lang === "ru" ? "MOBILE & NATIVE" : "MOBILE & NATIVE",
      items: ["Android SDK", "Kotlin", "Jetpack Compose", "JNI", "Rust Core"],
    },
    {
      category: lang === "ru" ? "BACKEND & TOOLING" : "BACKEND & TOOLING",
      items: ["Node.js", "Zod", "Playwright", "Vitest", "Docker", "Git"],
    },
  ];

  return (
    <section id="about" className="w-full py-20 px-6 md:px-12 border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Editorial Text Left */}
        <div className="lg:col-span-6 space-y-6">
          <span className="font-mono text-xs text-blue-600 font-bold uppercase tracking-widest">
            ABOUT // IVAN KULKIN
          </span>

          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-sans leading-tight">
            {lang === "ru"
              ? "От концепта и интерфейса до сборки и публикации."
              : "From concept and UI design to shipping production code."}
          </h2>

          <p className="text-lg text-neutral-700 dark:text-neutral-300 font-sans leading-relaxed">
            {lang === "ru"
              ? "Я самостоятельно прохожу путь от идеи и интерфейса до кода, тестов и публикации. Работаю с веб-продуктами, автоматизацией, данными, Android и системными компонентами."
              : "I independently manage the complete trajectory from product idea and interface design to code, testing, and production deployment. Specialized in web products, data automation, Android applications, and core systems."}
          </p>
        </div>

        {/* Tech Stack Groups Right */}
        <div className="lg:col-span-6 space-y-8 font-mono">
          {techGroups.map((group) => (
            <div key={group.category} className="space-y-3">
              <span className="text-xs text-neutral-500 font-bold tracking-wider">
                {"// "} {group.category}
              </span>
              <div className="flex flex-wrap gap-2">
                {group.items.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-md bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
