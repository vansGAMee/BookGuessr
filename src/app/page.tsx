import { getPublishedProjects, getFunnelStats } from "@/lib/projects/loader";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/layout/Hero";
import { ProjectStage } from "@/components/projects/ProjectStage";
import { ProjectIndex } from "@/components/projects/ProjectIndex";
import { PortfolioFunnel } from "@/components/charts/PortfolioFunnel";
import { About } from "@/components/layout/About";
import { Contact } from "@/components/layout/Contact";
import { Footer } from "@/components/layout/Footer";
import { XRayProvider } from "@/components/experience/XRayContext";
import { XRayLens } from "@/components/experience/XRayLens";
import { MobileLayerDivider } from "@/components/experience/MobileLayerDivider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ivan Kulkin (vansGAMee) — Developer Portfolio",
  description: "Senior Frontend Developer, UI/UX Architect & Systems Engineer. Portfolio showcasing web products, data tools, and offline native applications.",
  openGraph: {
    title: "Ivan Kulkin (vansGAMee) — Developer Portfolio",
    description: "Web products, data tools, and offline applications.",
    url: "https://vansgamee.github.io/",
    siteName: "VANSGAMEE / UNDER THE SURFACE",
  },
};

export default function HomePage() {
  const projects = getPublishedProjects();
  const funnelStats = getFunnelStats(projects);

  return (
    <XRayProvider>
      <div className="min-h-screen bg-[#F8F7F4] dark:bg-[#0B0D10] text-[#121316] dark:text-[#EDF1F7] selection:bg-blue-600 selection:text-white transition-colors duration-300">
        <Header />
        <XRayLens />
        <MobileLayerDivider />

        <main>
          {/* Hero Screen */}
          <Hero projects={projects} />

          {/* Selected Work Stages */}
          <section id="work" className="w-full">
            {projects.map((project) => (
              <ProjectStage key={project.slug} project={project} />
            ))}
          </section>

          {/* All Projects Index */}
          <ProjectIndex projects={projects} />

          {/* About Section */}
          <About />

          {/* Portfolio Pipeline Funnel */}
          <PortfolioFunnel stats={funnelStats} />

          {/* Contact Section */}
          <Contact />
        </main>

        <Footer />
      </div>
    </XRayProvider>
  );
}
