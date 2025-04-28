import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import Fastify, { FastifyInstance } from 'fastify';

import { drizzlePlugin } from './config/database';
import { db } from './config/drizzle.config';
import { errorHandler } from './middlewares/error-handler.middleware';
import loggerPlugin from './plugins/logger.plugin';
import { registerRoutes } from './routes';
import { createLogger, log } from './utils/logger.util';

// Create application logger
const logger = createLogger('server');

// Export db for use in other parts of the application
export { db };

export async function buildServer(): Promise<FastifyInstance> {
    const server = Fastify({
        logger: false, // Disable built-in logger as we're using our custom one
    });

    // Register our custom logger plugin
    await server.register(loggerPlugin);

    // Register plugins
    await server.register(cors, {
        origin: true,
    });
    log.info('CORS plugin registered');

    await server.register(jwt, {
        secret: process.env.JWT_SECRET || 'default-secret',
        sign: {
            expiresIn: process.env.JWT_EXPIRES_IN || '1d',
        },
    });
    log.info('JWT plugin registered');

    await server.register(multipart, {
        limits: {
            fileSize: 10 * 1024 * 1024, // 10MB
        },
    });
    log.info('Multipart plugin registered');

    // Register Swagger for OpenAPI specification
    await server.register(swagger, {
        swagger: {
            info: {
                title: 'Fastify API',
                description: 'API documentation for Fastify',
                version: '1.0.0',
            },
            host: 'localhost:3001',
            schemes: ['http'],
            consumes: ['application/json'],
            produces: ['application/json'],
        },
    });
    log.info('Swagger plugin registered');

    // Register Swagger UI
    await server.register(swaggerUi, {
        routePrefix: '/documentation',
        uiConfig: {
            docExpansion: 'list',
            deepLinking: false,
        },
    });
    log.info('Swagger UI plugin registered');

    // Register drizzle plugin
    await server.register(drizzlePlugin);
    log.info('Drizzle plugin registered');

    // Register global error handler
    server.setErrorHandler(errorHandler);
    log.info('Error handler registered');

    // Register all routes
    await registerRoutes(server);
    log.info('Routes registered');

    // Add 404 handler
    server.setNotFoundHandler((request, reply) => {
        log.warn(`Route not found: ${request.method} ${request.url}`);
        reply.status(404).send({ message: 'Route not found' });
    });
    log.info('Not found handler registered');

    return server;
}

// Graceful shutdown handler can be added in the index.ts file where server is started
