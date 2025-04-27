import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

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

    fastify.addHook('onClose', async () => {
        await pool.end();
    });
});
