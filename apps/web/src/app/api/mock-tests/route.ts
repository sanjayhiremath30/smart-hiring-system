import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // coding | aptitude | communication | hr
    const where: { type?: string } = {};
    if (type) where.type = type;
    const tests = await prisma.mockTest.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(tests);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch tests" }, { status: 500 });
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
    if (!body.type || !body.title || !body.questions) {
      return NextResponse.json(
        { error: "type, title, and questions are required" },
        { status: 400 }
      );
    }
    const test = await prisma.mockTest.create({
      data: {
        type: body.type,
        title: body.title,
        description: body.description || null,
        questions: body.questions,
        difficulty: body.difficulty || null,
        durationMins: body.durationMins ?? null,
      },
    });
    return NextResponse.json(test, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create test" }, { status: 500 });
  }
}
