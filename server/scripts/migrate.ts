#!/usr/bin/env node
import 'dotenv/config';

import { migrate } from 'drizzle-orm/node-postgres/migrator';

import { db, pool } from '../src/config/drizzle.config';

async function main() {
    console.log('Starting database migrations...');

    try {
        // Run migrations
        await migrate(db, { migrationsFolder: './drizzle' });
        console.log('Migrations completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    } finally {
        // Close the database connection
        await pool.end();
    }

    process.exit(0);
}

main();
