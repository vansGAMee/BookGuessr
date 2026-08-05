import { NextResponse } from "next/server";
import { isStudioEnabled, saveProjectData } from "@/lib/projects/writer";
import { getAllProjects } from "@/lib/projects/loader";

export async function GET() {
  if (!isStudioEnabled()) {
    return new NextResponse("Not Found", { status: 404 });
  }

  try {
    const projects = getAllProjects();
    return NextResponse.json({ success: true, projects });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isStudioEnabled()) {
    return new NextResponse("Not Found", { status: 404 });
  }

  try {
    const body = await req.json();
    const result = saveProjectData(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.status || 400 }
      );
    }

    return NextResponse.json({ success: true, project: result.project });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
