// Load environment variables first
import 'dotenv/config';

import { migrate } from 'drizzle-orm/node-postgres/migrator';

import { buildServer } from './app';
import { db } from './config/drizzle.config';

async function start() {
    // Run migrations in development mode
    if (process.env.NODE_ENV !== 'production') {
        try {
            // Run migrations
            await migrate(db, { migrationsFolder: './drizzle' });
            console.log('Migrations applied successfully');
        } catch (err) {
            console.error('Failed to run migrations:', err);
            // Continue even if migrations fail, as they might just not exist yet
        }
    }

    const server = await buildServer();

    try {
        await server.listen({ port: 3001, host: '0.0.0.0' });
        const address = server.server.address();
        const port = typeof address === 'string' ? address : address?.port;
        console.log(`Server listening on ${port}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    process.exit(0);
});

start();
