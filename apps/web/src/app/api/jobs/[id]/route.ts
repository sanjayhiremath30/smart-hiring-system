import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { auth } = await import("@/auth");
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin only" }, { status: 403 });
    }
    const { id } = await params;
    const body = await req.json();
    const skills = Array.isArray(body.skills)
      ? body.skills
      : typeof body.skills === "string"
      ? body.skills.split(",").map((s: string) => s.trim()).filter(Boolean)
      : undefined;
    const job = await prisma.job.update({
      where: { id },
      data: {
        ...(body.title != null && { title: body.title }),
        ...(body.description != null && { description: body.description }),
        ...(body.company != null && { company: body.company || null }),
        ...(body.location != null && { location: body.location || null }),
        ...(body.state != null && { state: body.state || null }),
        ...(body.salary != null && { salary: body.salary || null }),
        ...(body.applyUrl != null && { applyUrl: body.applyUrl || null }),
        ...(skills != null && { skills: skills.map((s: string) => s.toLowerCase()) }),
      },
    });
    return NextResponse.json(job);
  } catch (e) {
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { auth } = await import("@/auth");
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin only" }, { status: 403 });
    }
    const { id } = await params;
    await prisma.job.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}
