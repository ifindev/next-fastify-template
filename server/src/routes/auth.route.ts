import { FastifyInstance } from 'fastify';

import { AuthController } from '../controllers/auth.controller';
import { userRepository } from '../repositories';
import {
    loginSchema,
    meSchema,
    refreshTokenSchema,
    registerSchema,
} from '../schemas/api/auth.schema';
import { AuthService } from '../services/auth.service';

export async function authRoutes(fastify: FastifyInstance) {
    // Initialize dependencies
    const authService = new AuthService(userRepository);
    const authController = new AuthController(authService);

    // Auth routes
    fastify.post(
        '/register',
        {
            schema: registerSchema,
            config: {
                rateLimit: {
                    max: 5,
                    timeWindow: '1 hour',
                },
            },
        },
        authController.register.bind(authController),
    );

    fastify.post(
        '/login',
        {
            schema: loginSchema,
            config: {
                rateLimit: {
                    max: 10,
                    timeWindow: '15 minutes',
                },
            },
        },
        authController.login.bind(authController),
    );

    fastify.post(
        '/refresh-token',
        {
            schema: refreshTokenSchema,
            config: {
                rateLimit: {
                    max: 20,
                    timeWindow: '1 hour',
                },
            },
        },
        authController.refreshToken.bind(authController),
    );

    // Protected routes
    fastify.get(
        '/me',
        {
            schema: meSchema,
            preHandler: async (request, reply) => {
                try {
                    await request.jwtVerify();
                } catch (err) {
                    return reply.code(401).send({ message: 'Unauthorized' });
                }
            },
            config: {
                rateLimit: {
                    max: 50,
                    timeWindow: '1 minute',
                },
            },
        },
        authController.me.bind(authController),
    );
}
