const bcrypt = require("bcryptjs");

async function test() {
    const password = "password123";
    console.log("Hashing password...");
    const hash = await bcrypt.hash(password, 10);
    console.log("Hash:", hash);
    console.log("Comparing password...");
    const valid = await bcrypt.compare(password, hash);
    console.log("Valid:", valid);

    const invalid = await bcrypt.compare("wrongpassword", hash);
    console.log("Invalid should be false:", invalid);
}

test().catch(console.error);
