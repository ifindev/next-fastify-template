import { buildServer } from './app';

async function start() {
    // Run migrations in development mode
    if (process.env.NODE_ENV !== 'production') {
        try {
            // Import and run migrations without closing the pool
            const { migrate } = await import('drizzle-orm/node-postgres/migrator');
            const { db } = await import('./config/drizzle.config');

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
        console.log(`Server listening on ${server.server.address().port}`);
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
