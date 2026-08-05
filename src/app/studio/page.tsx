import { notFound } from "next/navigation";
import { isStudioEnabled } from "@/lib/projects/writer";
import { getAllProjects } from "@/lib/projects/loader";
import { StudioClient } from "./StudioClient";

export const metadata = {
  title: "Portfolio Studio — Local Editor",
};

export default function StudioPage() {
  if (!isStudioEnabled()) {
    notFound();
  }

  const projects = getAllProjects();

  return <StudioClient initialProjects={projects} />;
}
