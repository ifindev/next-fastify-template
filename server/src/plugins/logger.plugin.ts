import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

import { createLogger } from '../utils/logger.util';

const logger = createLogger('http');

const loggerPlugin: FastifyPluginAsync = async (fastify) => {
    // Add request logging
    fastify.addHook('onRequest', (request, reply, done) => {
        const { method, url, headers, ip } = request;
        const userAgent = headers['user-agent'];

        logger.debug(`Incoming request: ${method} ${url}`, {
            method,
            url,
            ip,
            userAgent,
        });

        done();
    });

    // Add response logging
    fastify.addHook('onResponse', (request, reply, done) => {
        const { method, url } = request;
        const { statusCode } = reply;
        const responseTime = reply.getResponseTime();

        // Color-code based on status
        let logFn = logger.info.bind(logger);

        if (statusCode >= 400 && statusCode < 500) {
            logFn = logger.warn.bind(logger);
        } else if (statusCode >= 500) {
            logFn = logger.error.bind(logger);
        }

        logFn(`Response: ${method} ${url} - ${statusCode} - ${responseTime.toFixed(2)}ms`, {
            method,
            url,
            statusCode,
            responseTime: responseTime.toFixed(2),
        });

        done();
    });

    // Add error logging
    fastify.addHook('onError', (request, reply, error, done) => {
        const { method, url } = request;

        logger.error(
            `Error: ${method} ${url} - ${error.message}`,
            {
                method,
                url,
                path: request.routerPath,
                params: request.params,
                query: request.query,
            },
            error,
        );

        done();
    });
};

export default fp(loggerPlugin, {
    name: 'logger',
    fastify: '4.x',
});
