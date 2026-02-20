const { Client } = require('pg');
const url = "postgresql://neondb_owner:npg_W6EVXbuoQO1s@ep-lingering-lab-aihyek33.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function testConn() {
    const client = new Client({
        connectionString: url,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        console.log("Successfully connected to PG!");
        const res = await client.query('SELECT NOW()');
        console.log("Database time:", res.rows[0]);
        await client.end();
    } catch (err) {
        console.error("PG Connection Error:", err);
        process.exit(1);
    }
}

testConn();
