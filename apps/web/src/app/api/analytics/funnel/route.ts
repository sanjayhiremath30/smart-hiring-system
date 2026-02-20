import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const applications = await prisma.application.findMany({
    where: { userId: session.user.id },
    select: { status: true },
  });

  const applied = applications.length;
  const shortlisted = applications.filter((a) => a.status === "PENDING").length;
  const selected = applications.filter((a) => a.status === "APPROVED").length;
  const rejected = applications.filter((a) => a.status === "REJECTED").length;
  const interviewed = 0; // optional: add INTERVIEWED status later

  return NextResponse.json({
    applied,
    shortlisted,
    interviewed,
    selected,
    rejected,
    stages: [
      { name: "Applied", value: applied, color: "cyan" },
      { name: "Shortlisted", value: shortlisted, color: "blue" },
      { name: "Interviewed", value: interviewed, color: "purple" },
      { name: "Selected", value: selected, color: "green" },
    ],
  });
}
