import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const state = searchParams.get("state");
    const skills = searchParams.get("skills"); // comma-separated

    const where: any = {};
    if (state) {
      where.OR = [
        { state: { contains: state, mode: "insensitive" } },
        { location: { contains: state, mode: "insensitive" } },
      ];
    }
    if (skills) {
      const skillList = skills.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
      if (skillList.length > 0) {
        where.skills = { hasSome: skillList };
      }
    }

    const jobs = await prisma.job.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Error in GET /api/jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { auth } = await import("@/auth");
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin only" }, { status: 403 });
    }
    const body = await req.json();

    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: "Title and Description are required" },
        { status: 400 }
      );
    }

    const skills = Array.isArray(body.skills)
      ? body.skills
      : typeof body.skills === "string"
        ? body.skills.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [];

    const job = await prisma.job.create({
      data: {
        title: body.title,
        description: body.description,
        status: "PENDING",
        company: body.company || null,
        location: body.location || null,
        state: body.state || null,
        salary: body.salary || null,
        skills: skills.map((s: string) => s.toLowerCase()),
        applyUrl: body.applyUrl || body.applyLink || null,
        createdBy: session?.user?.id ?? null,
      },
    });
    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error creating job" },
      { status: 500 }
    );
  }
}
