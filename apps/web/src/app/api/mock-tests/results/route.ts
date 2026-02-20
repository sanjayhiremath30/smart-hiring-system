import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { auth } = await import("@/auth");
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const adminView = searchParams.get("admin") === "true";
    if (adminView && session?.user?.role === "ADMIN") {
      const results = await prisma.userTestResult.findMany({
        include: { mockTest: { select: { title: true, type: true } }, user: { select: { email: true, name: true } } },
        orderBy: { completedAt: "desc" },
      });
      return NextResponse.json(results);
    }
    const myResults = await prisma.userTestResult.findMany({
      where: { userId: session.user.id },
      include: { mockTest: { select: { title: true, type: true } } },
      orderBy: { completedAt: "desc" },
    });
    return NextResponse.json(myResults);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { auth } = await import("@/auth");
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    if (!body.testId || typeof body.score !== "number") {
      return NextResponse.json({ error: "testId and score required" }, { status: 400 });
    }
    const result = await prisma.userTestResult.create({
      data: {
        userId: session.user.id,
        testId: body.testId,
        score: body.score,
        maxScore: body.maxScore ?? null,
        answers: body.answers ?? null,
      },
    });
    return NextResponse.json(result, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to save result" }, { status: 500 });
  }
}
