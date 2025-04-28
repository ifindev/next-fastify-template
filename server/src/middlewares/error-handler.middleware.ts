import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

import { createLogger } from '../utils/logger.util';

// Create a specialized logger for error handling
const logger = createLogger('error-handler');

export const errorHandler = (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    const { method, url, routerPath, ip } = request;

    // Handle validation errors
    if (error.validation) {
        logger.warn(`Validation error: ${method} ${url}`, {
            method,
            url,
            path: routerPath,
            ip,
            validationErrors: error.validation,
        });

        return reply.status(400).send({
            statusCode: 400,
            error: 'Bad Request',
            message: error.message,
            validationErrors: error.validation,
        });
    }

    // Handle custom errors
    if (error.statusCode) {
        // For 4xx errors, use warn level
        if (error.statusCode >= 400 && error.statusCode < 500) {
            logger.warn(`Client error (${error.statusCode}): ${method} ${url} - ${error.message}`, {
                method,
                url,
                path: routerPath,
                statusCode: error.statusCode,
                errorName: error.name,
            });
        } else {
            // For 5xx errors, use error level
            logger.error(
                `Server error (${error.statusCode}): ${method} ${url} - ${error.message}`,
                {
                    method,
                    url,
                    path: routerPath,
                    statusCode: error.statusCode,
                    errorName: error.name,
                },
                error,
            );
        }

        return reply.status(error.statusCode).send({
            statusCode: error.statusCode,
            error: error.name,
            message: error.message,
        });
    }

    // Handle unknown errors (500)
    logger.error(
        `Internal server error: ${method} ${url}`,
        {
            method,
            url,
            path: routerPath,
            ip,
        },
        error,
    );

    return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'An internal server error occurred',
    });
};
