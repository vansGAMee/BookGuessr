import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProjectBySlug, getPublishedProjects } from "@/lib/projects/loader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { XRayProvider } from "@/components/experience/XRayContext";
import { XRayLens } from "@/components/experience/XRayLens";
import { MobileLayerDivider } from "@/components/experience/MobileLayerDivider";
import { ProjectStage } from "@/components/projects/ProjectStage";
import { ArrowLeft, ArrowRight, ExternalLink, CheckCircle2, AlertCircle } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { Metadata } from "next";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = getPublishedProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title.en} — Ivan Kulkin (vansGAMee)`,
    description: project.summary.en,
    openGraph: {
      title: `${project.title.en} — Ivan Kulkin Portfolio`,
      description: project.summary.en,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const allProjects = getPublishedProjects();
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  return (
    <XRayProvider>
      <div className="min-h-screen bg-[#F8F7F4] dark:bg-[#0B0D10] text-[#121316] dark:text-[#EDF1F7]">
        <Header />
        <XRayLens />
        <MobileLayerDivider />

        <main className="pt-24 pb-20 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
          {/* Back Button */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Вернуться на главную</span>
            </Link>
          </div>

          {/* Dual Layer Live Project Stage */}
          <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-2xl">
            <ProjectStage project={project} />
          </div>

          {/* Details & Architecture Specs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-8">
              <div>
                <span className="font-mono text-xs text-blue-600 font-bold uppercase tracking-widest">
                  PROJECT SPECIFICATION // 0{project.order}
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-sans mt-2">
                  {project.title.ru}
                </h1>
                <p className="text-xl text-neutral-600 dark:text-neutral-300 font-sans mt-4 leading-relaxed">
                  {project.description.ru}
                </p>
              </div>

              {/* Verified Facts & Architectural Constraints */}
              <div className="space-y-4 font-mono text-xs border-t border-neutral-200 dark:border-neutral-800 pt-6">
                <span className="text-neutral-400 font-bold uppercase tracking-widest">
                  VERIFIED_PROOF & FACTS:
                </span>
                <ul className="space-y-3">
                  {project.proof.facts.ru.map((fact, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-neutral-800 dark:text-neutral-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{fact}</span>
                    </li>
                  ))}
                  {project.proof.limitations?.ru.map((lim, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-amber-600 dark:text-amber-400">
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>{lim}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Additional Gallery Screenshots if available */}
              {project.media && project.media.length > 1 && (
                <div className="space-y-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                  <h3 className="text-lg font-bold font-sans">Галерея материалов</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.media.slice(1).map((item, idx) => (
                      <div
                        key={idx}
                        className="relative h-64 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900"
                      >
                        <Image
                          src={item.src}
                          alt={item.alt.ru}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Specifications */}
            <div className="lg:col-span-4 space-y-8 font-mono text-xs border-t lg:border-t-0 lg:border-l border-neutral-200 dark:border-neutral-800 pt-8 lg:pt-0 lg:pl-8">
              <div className="space-y-2">
                <span className="text-neutral-500 font-bold uppercase tracking-wider">STATUS:</span>
                <div className="text-sm font-semibold uppercase text-blue-600 dark:text-blue-400">
                  {project.status}
                </div>
              </div>

              {project.role && (
                <div className="space-y-2">
                  <span className="text-neutral-500 font-bold uppercase tracking-wider">ROLE:</span>
                  <div className="text-sm font-medium">{project.role.ru}</div>
                </div>
              )}

              <div className="space-y-2">
                <span className="text-neutral-500 font-bold uppercase tracking-wider">TECH STACK:</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                {project.liveUrl && project.showLive !== false && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors"
                  >
                    <span>Открыть Live Demo</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-bold text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <GithubIcon className="w-4 h-4" />
                    <span>Репозиторий GitHub</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Next Project Footer Link */}
          {nextProject && (
            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-12">
              <Link
                href={`/projects/${nextProject.slug}`}
                className="group flex items-center justify-between p-8 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 transition-all"
              >
                <div>
                  <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest">
                    NEXT PROJECT // 0{nextProject.order}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-extrabold font-sans mt-1 group-hover:text-blue-600 transition-colors">
                    {nextProject.title.ru}
                  </h3>
                </div>
                <ArrowRight className="w-6 h-6 text-neutral-400 group-hover:text-blue-600 group-hover:translate-x-2 transition-all" />
              </Link>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </XRayProvider>
  );
}
