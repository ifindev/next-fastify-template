// Load environment variables first
import 'dotenv/config';

import { migrate } from 'drizzle-orm/node-postgres/migrator';

import { buildServer } from './app';
import { db } from './config/drizzle.config';
import { dbLogger } from './utils/db-logger.util';
import { log } from './utils/logger.util';

async function start() {
    log.info('Starting server...');

    // Log environment
    log.info(`Server environment: ${process.env.NODE_ENV || 'development'}`);

    // Run migrations in development mode
    if (process.env.NODE_ENV !== 'production') {
        try {
            // Run migrations
            log.info('Running database migrations');
            await migrate(db, { migrationsFolder: './drizzle' });
            dbLogger.migration('Migrations applied successfully');
        } catch (err) {
            const error = err as Error;
            dbLogger.migration('Failed to run migrations', { error: error.message });
            log.error('Failed to run migrations', {}, error);
            // Continue even if migrations fail, as they might just not exist yet
        }
    }

    try {
        log.info('Building server');
        const server = await buildServer();

        log.info('Starting HTTP server');
        await server.listen({ port: 3001, host: '0.0.0.0' });
        const address = server.server.address();
        const port = typeof address === 'string' ? address : address?.port;
        log.info(`Server listening on port ${port}`, { port });
    } catch (err) {
        const error = err as Error;
        log.fatal('Server failed to start', {}, error);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    log.info('Shutting down server...');
    process.exit(0);
});

process.on('uncaughtException', (error) => {
    log.fatal('Uncaught exception', {}, error);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    log.fatal('Unhandled rejection', { reason });
    process.exit(1);
});

start();
