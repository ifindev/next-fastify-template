import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

import { dbLogger } from '../utils/db-logger.util';
import { db, pool } from './drizzle.config';

// Extend FastifyInstance to include db
declare module 'fastify' {
    interface FastifyInstance {
        db: typeof db;
    }
}

// Export a Fastify plugin to make Drizzle available in the request context
export const drizzlePlugin = fp(async (fastify: FastifyInstance) => {
    fastify.decorate('db', db);
    dbLogger.connection('Database plugin initialized');

    // Add hook to log when transaction begins (can be extended further)
    fastify.addHook('onRequest', async (request) => {
        request.raw.on('close', () => {
            if (request.raw.aborted) {
                dbLogger.connection('Request aborted, potential orphaned database operations');
            }
        });
    });

    fastify.addHook('onClose', async () => {
        dbLogger.connection('Closing database pool');
        await pool.end();
        dbLogger.connection('Database pool closed');
    });
});
