import { migrate } from 'drizzle-orm/node-postgres/migrator';

import { db, pool } from '../config/drizzle.config';

// Function to run migrations
export async function runMigrations() {
    console.log('Running migrations...');

    try {
        await migrate(db, { migrationsFolder: './drizzle' });
        console.log('Migrations completed successfully');
    } catch (error) {
        console.error('Error running migrations:', error);
        throw error;
    } finally {
        // Close the pool when done
        await pool.end();
    }
}

// Run migrations if this file is executed directly
if (require.main === module) {
    runMigrations()
        .then(() => {
            console.log('Migration script completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Migration script failed:', error);
            process.exit(1);
        });
}
