const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function debugAuth() {
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
            console.log(`🔐 Password Hash: ${user.passwordHash.substring(0, 20)}...`);
            console.log(`🔐 Hash Length: ${user.passwordHash.length} chars`);

            // Check if hash looks like bcrypt
            const isBcrypt = user.passwordHash.startsWith('$2a$') || user.passwordHash.startsWith('$2b$');
            console.log(`✓ Is bcrypt format: ${isBcrypt ? '✅ YES' : '❌ NO'}`);

            if (!isBcrypt) {
                console.log('⚠️  WARNING: Password is NOT hashed with bcrypt!');
                console.log('   This will cause login failures.');
            }

            console.log('');
        }

        console.log('─'.repeat(60));
        console.log('\n🧪 Testing password comparison...\n');

        // Prompt for test credentials
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        readline.question('Enter email to test (or press Enter to skip): ', async (testEmail) => {
            if (!testEmail.trim()) {
                console.log('Skipping password test.');
                await prisma.$disconnect();
                readline.close();
                return;
            }

            readline.question('Enter password to test: ', async (testPassword) => {
                const normalizedEmail = testEmail.trim().toLowerCase();
                const user = users.find(u => u.email === normalizedEmail);

                if (!user) {
                    console.log(`\n❌ User with email "${normalizedEmail}" not found!`);
                    console.log(`Available emails: ${users.map(u => u.email).join(', ')}`);
                } else {
                    console.log(`\n🔍 Testing credentials for: ${user.email}`);
                    console.log(`Password entered: "${testPassword}"`);
                    console.log(`Password length: ${testPassword.length}`);

                    try {
                        const isValid = await bcrypt.compare(testPassword, user.passwordHash);
                        console.log(`\n${isValid ? '✅ PASSWORD MATCH!' : '❌ PASSWORD DOES NOT MATCH'}`);

                        if (!isValid) {
                            console.log('\n🔍 Debugging info:');
                            console.log('   - Check if password has extra spaces');
                            console.log('   - Verify you\'re using the exact password from registration');
                            console.log('   - Check if password was hashed correctly during registration');
                        }
                    } catch (error) {
                        console.log(`\n❌ Error comparing passwords: ${error.message}`);
                    }
                }

                await prisma.$disconnect();
                readline.close();
            });
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
        await prisma.$disconnect();
        process.exit(1);
    }
}

debugAuth();
