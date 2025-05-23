import { FastifyReply } from 'fastify';

import { AuthenticateOptions } from '../middlewares/authenticate.middleware';

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (
            request: FastifyRequest,
            reply: FastifyReply,
            options?: AuthenticateOptions,
        ) => Promise<void>;
    }

    interface FastifyRequest {
        user: {
            id: string;
            email: string;
            role: string;
        };
    }

    // RateLimit is already defined in the @fastify/rate-limit v8.x package
}
