import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }
    const hash = await bcrypt.hash(password, 10);
    const role = body.role === "ADMIN" ? "ADMIN" : "STUDENT";
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash: hash,
        name: typeof body.name === "string" ? body.name.trim() || null : null,
        role,
      },
    });
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("Register error:", error);
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
            "Database is not connected. Set up a free database (takes 2 minutes) so you can register and login.",
          code: "DATABASE_NOT_CONFIGURED",
        },
        { status: 503 }
      );
    }
    const message = msg || "Registration failed";
    return NextResponse.json(
      { error: process.env.NODE_ENV === "development" ? message : "Registration failed" },
      { status: 500 }
    );
  }
}
