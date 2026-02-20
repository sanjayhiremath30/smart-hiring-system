import { Worker } from "bullmq";
import IORedis from "ioredis";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const connection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  "test-queue",
  async (job) => {
    console.log("Processing job:", job.data);

    // 1️⃣ Create job in DB as PROCESSING
    const createdJob = await prisma.job.create({
      data: {
        title: job.data.name,
        description: job.data.message,
        status: "PROCESSING",
      },
    });

    // 2️⃣ Simulate 3 second processing
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // 3️⃣ Update job status to COMPLETED
    await prisma.job.update({
      where: { id: createdJob.id },
      data: { status: "COMPLETED" },
    });

    console.log("Job saved and completed in DB 🚀");
  },
  { connection }
);

console.log("Worker is running...");
