import fastifyRateLimit from '@fastify/rate-limit';
import { FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

// Define options for rate limiting
export interface RateLimitOptions {
    // Default options can be overridden per-route
    max?: number; // Max requests per timeWindow
    timeWindow?: string | number; // Timeframe for rate limit in ms or human readable format ('1m', '1h')
}

// Export the rate limit middleware plugin
export const rateLimit = fp(async (fastify, options: RateLimitOptions = {}) => {
    // Register the rate limit plugin
    await fastify.register(fastifyRateLimit, {
        // Global defaults
        max: options.max || 100, // Default to 100 requests per time window
        timeWindow: options.timeWindow || '1 minute',

        // Error handler for rate limit exceeded
        errorResponseBuilder: (req: FastifyRequest, context) => {
            return {
                statusCode: 429,
                error: 'Too Many Requests',
                message: 'Rate limit exceeded, please try again later',
            };
        },

        // Redis could be used for distributed rate limiting in a multi-server setup
        // redis: process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : undefined,

        // Optional: Add the remaining rate limit info to all responses
        addHeaders: {
            'x-ratelimit-limit': true,
            'x-ratelimit-remaining': true,
            'x-ratelimit-reset': true,
            'retry-after': true,
        },
    });
});
