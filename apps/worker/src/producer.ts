import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null
});

const queue = new Queue("test-queue", { connection });

async function addJob() {
  await queue.add("my-job", {
    name: "Sanjay",
    message: "Hello from Producer 🚀"
  });

  console.log("Job added successfully!");
  process.exit(0);
}

addJob();
