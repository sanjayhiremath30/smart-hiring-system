import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { message: "If an account exists with this email, you will receive a reset link." },
        { status: 200 }
      );
    }
    await prisma.passwordResetToken.deleteMany({ where: { email } });
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await prisma.passwordResetToken.create({
      data: { email, token, expiresAt },
    });
    const baseUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    const resetLink = `${baseUrl}/reset-password?token=${token}`;
    if (process.env.NODE_ENV === "development") {
      return NextResponse.json({
        message: "Check your email for reset link. In development, use the link below:",
        resetLink,
      });
    }
    return NextResponse.json({
      message: "If an account exists with this email, you will receive a reset link.",
    });
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("Forgot password error:", error);
    }
    const msg = error instanceof Error ? error.message : "";
    const isDbDown =
      msg.includes("Can't reach database") ||
      msg.includes("localhost:5432") ||
      (error as { code?: string })?.code === "P1001";
    if (isDbDown) {
      return NextResponse.json(
        {
          error:
            "Database is not connected. Set up a free database first (see Setup guide) — then register, login, and password reset will work.",
          code: "DATABASE_NOT_CONFIGURED",
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Failed to send recovery. Try again or set up the database (Setup guide)." },
      { status: 500 }
    );
  }
}
