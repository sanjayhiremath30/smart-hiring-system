-- AlterTable: add createdBy to Job
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema=current_schema() AND table_name='Job' AND column_name='createdBy') THEN
    ALTER TABLE "Job" ADD COLUMN "createdBy" TEXT;
  END IF;
END $$;

-- Drop source column (LinkedIn/Indeed/Foundit removed)
ALTER TABLE "Job" DROP COLUMN IF EXISTS "source";

-- CreateTable MockTest
CREATE TABLE "MockTest" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "questions" JSONB NOT NULL,
    "difficulty" TEXT,
    "durationMins" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MockTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable UserTestResult
CREATE TABLE "UserTestResult" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "maxScore" DOUBLE PRECISION,
    "answers" JSONB,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserTestResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserTestResult" ADD CONSTRAINT "UserTestResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserTestResult" ADD CONSTRAINT "UserTestResult_testId_fkey" FOREIGN KEY ("testId") REFERENCES "MockTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
