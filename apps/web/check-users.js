// process.env.DATABASE_URL is picked up from .env automatically by Prisma

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('🔍 Fetching all users from database...\n');

        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                passwordHash: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });

        if (users.length === 0) {
            console.log('❌ No users found in database!');
            console.log('💡 Please register a user first at http://localhost:3000/register\n');
            return;
        }

        console.log(`✅ Found ${users.length} user(s):\n`);

        for (const user of users) {
            console.log('─'.repeat(60));
            console.log(`📧 Email: ${user.email}`);
            console.log(`👤 Name: ${user.name || 'N/A'}`);
            console.log(`🔑 Role: ${user.role}`);
            console.log(`🆔 ID: ${user.id}`);
            console.log(`📅 Created: ${user.createdAt}`);
            console.log(`🔐 Password Hash (first 30 chars): ${user.passwordHash.substring(0, 30)}...`);
            console.log(`🔐 Hash Length: ${user.passwordHash.length} chars`);

            // Check if hash looks like bcrypt
            const isBcrypt = user.passwordHash.startsWith('$2a$') || user.passwordHash.startsWith('$2b$');
            console.log(`✓ Is bcrypt format: ${isBcrypt ? '✅ YES' : '❌ NO - THIS IS THE PROBLEM!'}`);

            if (!isBcrypt) {
                console.log('⚠️  WARNING: Password is NOT hashed with bcrypt!');
                console.log('   This will cause login failures even with correct password.');
                console.log('   The password appears to be stored in plain text or wrong format.');
            }

            console.log('');
        }

        console.log('─'.repeat(60));
        console.log('\n💡 To test login with a specific user:');
        console.log('   1. Use one of the emails listed above');
        console.log('   2. Use the password you registered with');
        console.log('   3. If bcrypt format is NO, you need to re-register\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.code) console.error('Error Code:', error.code);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
