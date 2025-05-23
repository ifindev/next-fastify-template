import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import Fastify, { FastifyInstance } from 'fastify';

import { drizzlePlugin } from './config/database';
import { db } from './config/drizzle.config';
import { errorHandler } from './middlewares/error-handler.middleware';
import { rateLimit } from './middlewares/rate-limit.middleware';
import loggerPlugin from './plugins/logger.plugin';
import { registerRoutes } from './routes';
import { log } from './utils/logger.util';

// Export db for use in other parts of the application
export { db };

export async function buildServer(): Promise<FastifyInstance> {
    const server = Fastify({
        logger: false, // Disable built-in logger as we're using our custom one
    });

    // Register our custom logger plugin
    await server.register(loggerPlugin);

    // Add content-type parser
    server.addContentTypeParser('application/json', { parseAs: 'string' }, (req, body, done) => {
        try {
            const json = body.length > 0 ? JSON.parse(body as string) : {};
            done(null, json);
        } catch (err) {
            done(err as Error, undefined);
        }
    });
    log.info('Content-type parser registered');

    // Register plugins
    await server.register(cors, {
        origin: '*',
        methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    });
    log.info('CORS plugin registered');

    // Register rate limit plugin
    await server.register(rateLimit, {
        max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
        timeWindow: process.env.RATE_LIMIT_WINDOW || '1 minute',
    });
    log.info('Rate limit plugin registered');

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
            schemes: ['http', 'https'],
            consumes: ['application/json'],
            produces: ['application/json'],
            securityDefinitions: {
                bearerAuth: {
                    type: 'apiKey',
                    name: 'Authorization',
                    in: 'header',
                },
            },
        },
    });
    log.info('Swagger plugin registered');

    // Register Swagger UI
    await server.register(swaggerUi, {
        routePrefix: '/documentation',
        uiConfig: {
            docExpansion: 'list',
            deepLinking: false,
            tryItOutEnabled: true,
            persistAuthorization: true,
        },
        staticCSP: false,
        transformSpecificationClone: true,
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
