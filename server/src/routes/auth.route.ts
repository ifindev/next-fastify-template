import { FastifyInstance } from 'fastify';

import { AuthController } from '../controllers/auth.controller';
import { userRepository } from '../repositories';
import { AuthService } from '../services/auth.service';

export async function authRoutes(fastify: FastifyInstance) {
    // Initialize dependencies
    const authService = new AuthService(userRepository);
    const authController = new AuthController(authService);

    // Auth routes
    fastify.post('/register', authController.register.bind(authController));
    fastify.post('/login', authController.login.bind(authController));

    // Protected routes
    fastify.get(
        '/me',
        {
            preHandler: async (request, reply) => {
                try {
                    await request.jwtVerify();
                } catch (err) {
                    return reply.code(401).send({ message: 'Unauthorized' });
                }
            },
        },
        authController.me.bind(authController),
    );
}
