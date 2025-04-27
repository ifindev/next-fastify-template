import { FastifyInstance } from 'fastify';

import { prisma } from '../config/database';
import { AuthController } from '../controllers/auth.controller';
import { UserRepository } from '../repositories/user.repository';
import { AuthService } from '../services/auth.service';

export async function authRoutes(fastify: FastifyInstance) {
    // Initialize dependencies
    const userRepository = new UserRepository(prisma);
    const authService = new AuthService(prisma);
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
