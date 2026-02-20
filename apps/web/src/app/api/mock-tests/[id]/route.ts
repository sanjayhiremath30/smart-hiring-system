import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const test = await prisma.mockTest.findUnique({ where: { id } });
    if (!test) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(test);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch test" }, { status: 500 });
  }
}

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
    const test = await prisma.mockTest.update({
      where: { id },
      data: {
        ...(body.title != null && { title: body.title }),
        ...(body.description != null && { description: body.description }),
        ...(body.questions != null && { questions: body.questions }),
        ...(body.difficulty != null && { difficulty: body.difficulty }),
        ...(body.durationMins != null && { durationMins: body.durationMins }),
      },
    });
    return NextResponse.json(test);
  } catch (e) {
    return NextResponse.json({ error: "Failed to update test" }, { status: 500 });
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
    await prisma.mockTest.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete test" }, { status: 500 });
  }
}
