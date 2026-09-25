import { Pool } from "pg";

let pool: Pool | null = null;

// start the database connection pool.
export function getPool(): Pool {
    if (!pool) {
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) {
            throw new Error("Database connection is not set")
        }
        pool = new Pool({ connectionString })
    }
    return pool
}


// close the database connection pool.
export async function closePool(): Promise<void> {
    if (pool) {
        await pool.end()
        pool = null;
    }
}