const fs = require("fs");
const path = require("path");

const pool = require("../src/db/database");

async function runMigrations() {

    const client = await pool.connect();

    try {

        console.log("Starting database migrations...");

        await client.query(`
            CREATE TABLE IF NOT EXISTS schema_migrations (
                id SERIAL PRIMARY KEY,
                filename VARCHAR(255) UNIQUE NOT NULL,
                executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);

        const migrationsPath = path.join(
            __dirname,
            "../database/migrations"
        );

        const files = fs
            .readdirSync(migrationsPath)
            .filter(file => file.endsWith(".sql"))
            .sort();

        const result = await client.query(`
            SELECT filename
            FROM schema_migrations
        `);

        const executedMigrations = new Set(
            result.rows.map(row => row.filename)
        );

        for (const file of files) {

            if (executedMigrations.has(file)) {
                continue;
            }

            console.log(`Running migration: ${file}`);

            const filePath = path.join(
                migrationsPath,
                file
            );

            const sql = fs.readFileSync(
                filePath,
                "utf8"
            );

            await client.query("BEGIN");

            try {

                await client.query(sql);

                await client.query(
                    `
                    INSERT INTO schema_migrations (filename)
                    VALUES ($1)
                    `,
                    [file]
                );

                await client.query("COMMIT");

                console.log(
                    `Migration completed: ${file}`
                );

            } catch (error) {

                await client.query("ROLLBACK");

                throw error;
            }
        }

        console.log("All migrations completed.");

    } catch (error) {

        console.error(
            "Migration error:",
            error
        );

        process.exitCode = 1;

    } finally {

        client.release();
    }
}

runMigrations();