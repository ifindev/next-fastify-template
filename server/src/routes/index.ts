import { FastifyInstance } from 'fastify';

import { prismaPlugin } from '../config/database';
import { authenticate } from '../middlewares/authenticate.middleware';
import { authRoutes } from './auth.route';
import { fileRoutes } from './file.route';

export async function registerRoutes(server: FastifyInstance) {
    // Register plugins
    await server.register(prismaPlugin);
    await server.register(authenticate);

    // Register routes under the /api prefix
    await server.register(
        async (fastify) => {
            await fastify.register(authRoutes, { prefix: '/auth' });
            await fastify.register(fileRoutes, { prefix: '/files' });
        },
        { prefix: '/api' },
    );
}
