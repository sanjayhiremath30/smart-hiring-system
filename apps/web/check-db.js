const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Connecting to database...');
        const jobs = await prisma.job.findMany();
        console.log('Jobs count:', jobs.length);
        console.log('Jobs:', JSON.stringify(jobs, null, 2));

        if (jobs.length === 0) {
            console.log('No jobs found. Creating a test job...');
            try {
                const newJob = await prisma.job.create({
                    data: {
                        title: 'Test Job from Script',
                        description: 'This is a test job created via script to verify DB connection.',
                        company: 'Test Company',
                        location: 'Remote',
                        state: 'Remote',
                        skills: ['Node.js', 'Prisma'],
                        status: 'PENDING',
                    },
                });
                console.log('Created job:', newJob);
            } catch (createError) {
                console.error('Error creating job:', createError);
            }
        }
    } catch (e) {
        console.error('Error fetching jobs:', e);
        if (e.name) console.error('Error Name:', e.name);
        if (e.code) console.error('Error Code:', e.code);
        if (e.message) console.error('Error Message:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
