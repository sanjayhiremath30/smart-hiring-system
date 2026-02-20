import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrisma() {
  console.log("Creating Prisma Client...");
  console.log("DATABASE_URL present:", !!process.env.DATABASE_URL);
  if (process.env.DATABASE_URL) {
    const masked = process.env.DATABASE_URL.replace(/:[^@]*@/, ":***@");
    console.log("Using DATABASE_URL:", masked);
  }
  const client = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }
  return client;
}

export const prisma = globalForPrisma.prisma ?? createPrisma();
