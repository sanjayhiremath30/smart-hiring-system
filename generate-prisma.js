const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DATABASE_URL = "postgresql://neondb_owner:npg_W6EVXbuoQO1s@ep-lingering-lab-aihyek33.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require";
process.env.DATABASE_URL = DATABASE_URL;

const prismaPath = path.join(process.cwd(), 'node_modules', '.pnpm', 'prisma@5.22.0', 'node_modules', 'prisma', 'build', 'index.js');
const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');

console.log('Prisma Index Path:', prismaPath);
console.log('Schema Path:', schemaPath);
console.log('DATABASE_URL present:', !!process.env.DATABASE_URL);

try {
    console.log('Running Prisma generate...');
    execSync(`node "${prismaPath}" generate --schema="${schemaPath}"`, {
        stdio: 'inherit',
        env: process.env
    });
    console.log('SUCCESS: Prisma client generated.');
} catch (error) {
    console.error('FAILED: Prisma generation failed.');
    console.error(error.message);
    process.exit(1);
}
