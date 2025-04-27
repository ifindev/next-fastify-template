import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import swagger from '@fastify/swagger';
import Fastify, { FastifyInstance } from 'fastify';

import { errorHandler } from './middlewares/error-handler.middleware';
import { registerRoutes } from './routes';

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
