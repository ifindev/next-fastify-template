import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { dbLogger } from '../utils/db-logger.util';

// Create a PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Log database connection events
pool.on('connect', () => {
    dbLogger.connection('New database connection established');
});

pool.on('error', (err) => {
    dbLogger.connection('Database connection error', { error: err.message });
});

// Create a Drizzle instance using the pool
export const db = drizzle(pool, {
    logger: {
        logQuery: (query, params) => {
            dbLogger.query(query, params);
        },
    },
});

// Export the pool to allow manual pool management if needed
export { pool };
