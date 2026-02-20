import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();

    if (!body.name || !body.email || !body.jobId) {
      return NextResponse.json(
        { error: "Name, email, and jobId are required" },
        { status: 400 }
      );
    }

    const application = await prisma.application.create({
      data: {
        name: body.name,
        email: body.email,
        jobId: body.jobId,
        status: "PENDING",
        userId: session?.user?.id || null,
      },
      include: {
        job: true,
      },
    });

    // Create notifications for all admins
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
    });
    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          type: "NEW_APPLICATION",
          title: "New Application",
          message: `${body.name} (${body.email}) applied for "${application.job.title}"`,
          applicationId: application.id,
        },
      });
    }

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await auth();
  const applications = await prisma.application.findMany({
    include: { job: true },
    orderBy: { createdAt: "desc" },
  });
  if (session?.user?.role === "ADMIN") {
    return NextResponse.json(applications);
  }
  if (session?.user?.id) {
    return NextResponse.json(
      applications.filter((a) => a.userId === session.user?.id || a.email === session.user?.email)
    );
  }
  return NextResponse.json([]);
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }
  const body = await req.json();

  const app = await prisma.application.findUnique({
    where: { id: body.id },
    include: { job: true, user: true },
  });
  if (!app) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.application.update({
    where: { id: body.id },
    data: { status: body.status },
  });

  // Notify the applicant (if they have an account)
  const applicantUserId = app.userId || app.user?.id;
  const userId = applicantUserId
    ? applicantUserId
    : (await prisma.user.findUnique({ where: { email: app.email } }))?.id;
  if (userId) {
    await prisma.notification.create({
      data: {
        userId,
        type: "STATUS_UPDATE",
        title: `Application ${body.status}`,
        message: `Your application for "${app.job.title}" at ${app.job.company || "Company"} has been ${body.status.toLowerCase()}.`,
        applicationId: app.id,
      },
    });
  }

  return NextResponse.json(updated);
}
