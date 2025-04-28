import { createLogger } from './logger.util';

const logger = createLogger('database');

export const dbLogger = {
    query: (query: string, params?: unknown[]) => {
        logger.debug('Executing query', {
            query,
            params: params || [],
        });
    },

    queryError: (query: string, params: unknown[] | undefined, error: Error) => {
        logger.error(
            'Query execution failed',
            {
                query,
                params: params || [],
            },
            error,
        );
    },

    connection: (message: string, details?: Record<string, unknown>) => {
        logger.info(message, details);
    },

    migration: (message: string, details?: Record<string, unknown>) => {
        logger.info(`Migration: ${message}`, details);
    },

    transaction: {
        start: (id: string) => {
            logger.debug(`Transaction started: ${id}`);
        },

        commit: (id: string) => {
            logger.debug(`Transaction committed: ${id}`);
        },

        rollback: (id: string, error?: Error) => {
            if (error) {
                logger.error(`Transaction rolled back: ${id}`, {}, error);
            } else {
                logger.warn(`Transaction rolled back: ${id}`);
            }
        },
    },
};
