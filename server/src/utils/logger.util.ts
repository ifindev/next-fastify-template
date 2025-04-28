import pino from 'pino';

// Log level configuration
export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

// Default log level
const LOG_LEVEL = (process.env.LOG_LEVEL as LogLevel) || 'info';

// Create pretty transport for development
const prettyTransport = {
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            levelFirst: true,
            translateTime: 'SYS:standard',
        },
    },
};

// Configure logger options
const loggerOptions =
    process.env.NODE_ENV === 'production'
        ? { level: LOG_LEVEL }
        : {
              level: LOG_LEVEL,
              ...prettyTransport,
          };

// Create base logger instance
const baseLogger = pino(loggerOptions);

// Create customized logger with context
export const createLogger = (context: string) => {
    return baseLogger.child({ context });
};

// Default logger instance
export const logger = createLogger('app');

// Log method helpers with type definitions
export const log = {
    trace: (message: string, obj?: object) => logger.trace(obj || {}, message),
    debug: (message: string, obj?: object) => logger.debug(obj || {}, message),
    info: (message: string, obj?: object) => logger.info(obj || {}, message),
    warn: (message: string, obj?: object) => logger.warn(obj || {}, message),
    error: (message: string, obj?: object, err?: Error) => {
        if (err) {
            const errorObj = {
                ...obj,
                error: {
                    message: err.message,
                    stack: err.stack,
                    name: err.name,
                },
            };
            logger.error(errorObj, message);
        } else {
            logger.error(obj || {}, message);
        }
    },
    fatal: (message: string, obj?: object, err?: Error) => {
        if (err) {
            const errorObj = {
                ...obj,
                error: {
                    message: err.message,
                    stack: err.stack,
                    name: err.name,
                },
            };
            logger.fatal(errorObj, message);
        } else {
            logger.fatal(obj || {}, message);
        }
    },
};
