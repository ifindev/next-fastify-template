import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import Fastify, { FastifyInstance } from 'fastify';

import { drizzlePlugin } from './config/database';
import { db } from './config/drizzle.config';
import { errorHandler } from './middlewares/error-handler.middleware';
import { registerRoutes } from './routes';

// Export db for use in other parts of the application
export { db };

export async function buildServer(): Promise<FastifyInstance> {
    const server = Fastify({
        logger: true,
    });

    // Register plugins
    await server.register(cors, {
        origin: true,
    });

    await server.register(jwt, {
        secret: process.env.JWT_SECRET || 'default-secret',
        sign: {
            expiresIn: process.env.JWT_EXPIRES_IN || '1d',
        },
    });

    await server.register(multipart, {
        limits: {
            fileSize: 10 * 1024 * 1024, // 10MB
        },
    });

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

    // Register Swagger UI
    await server.register(swaggerUi, {
        routePrefix: '/documentation',
        uiConfig: {
            docExpansion: 'list',
            deepLinking: false,
        },
    });

    // Register drizzle plugin
    await server.register(drizzlePlugin);

    // Register global error handler
    server.setErrorHandler(errorHandler);

    // Register all routes
    await registerRoutes(server);

    // Add 404 handler
    server.setNotFoundHandler((request, reply) => {
        reply.status(404).send({ message: 'Route not found' });
    });

    return server;
}

// Graceful shutdown handler can be added in the index.ts file where server is started
