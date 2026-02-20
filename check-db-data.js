const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const jobs = await prisma.job.count();
    const applications = await prisma.application.count();
    const users = await prisma.user.count();
    const mockTests = await prisma.mockTest.count();

    console.log("Database Stats:");
    console.log("- Jobs:", jobs);
    console.log("- Applications:", applications);
    console.log("- Users:", users);
    console.log("- Mock Tests:", mockTests);

    if (jobs > 0) {
        const lastJob = await prisma.job.findFirst({ orderBy: { createdAt: 'desc' } });
        console.log("Latest Job:", lastJob.title, "(Status:", lastJob.status, ")");
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
