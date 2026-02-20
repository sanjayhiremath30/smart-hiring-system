import { Worker } from "bullmq";
import IORedis from "ioredis";
import { handleTestJob } from "../jobs/test.job";

const connection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null
});

export function startTestWorker() {
  const worker = new Worker(
    "test-queue",
    async (job) => {
      await handleTestJob(job.data);
    },
    { connection }
  );

  console.log("Test Worker started...");
}
