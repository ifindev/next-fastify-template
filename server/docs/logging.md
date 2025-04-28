# Logging System Documentation

The server uses a comprehensive logging system based on [Pino](https://getpino.io/), a fast JSON logger for Node.js.

## Log Levels

The logging system supports the following levels (in order of increasing severity):

- **trace**: Very detailed information for debugging specific issues
- **debug**: Detailed information useful during development
- **info**: Normal application behavior, confirmation that things are working as expected
- **warn**: Unexpected or undesirable events that don't prevent the application from working
- **error**: Issues that prevent specific operations from working correctly
- **fatal**: Critical issues that cause the application to stop working

## Configuration

The log level can be configured via the `LOG_LEVEL` environment variable:

```
LOG_LEVEL=debug  # Options: trace, debug, info, warn, error, fatal
```

In development, logs are prettified and colorized for readability. In production, they are output as JSON for machine processing.

## Color-Coding

Log messages are color-coded based on their level and HTTP status codes:

- **Successful responses** (2xx): Green (info level)
- **Client errors** (4xx): Yellow (warn level)
- **Server errors** (5xx): Red (error level)

## Log Categories

The logging system is divided into multiple specialized loggers:

- **app**: General application logs
- **server**: Server startup and shutdown logs
- **http**: HTTP request and response logs
- **database**: Database operations logs
- **error-handler**: Error handling logs

## Usage

To use the logging system in your code:

```typescript
import { createLogger, log } from '../utils/logger.util';

// Create a context-specific logger
const logger = createLogger('my-context');

// Log messages with different levels
logger.info('This is an info message');
logger.warn('This is a warning');
logger.error('This is an error', {}, new Error('Error details'));

// Or use the global logger
log.info('This is an info message from the global logger');
```

## Database Logging

The system includes specialized logging for database operations:

```typescript
import { dbLogger } from '../utils/db-logger.util';

dbLogger.query('SELECT * FROM users', []);
dbLogger.transaction.start('tx-123');
dbLogger.migration('Applied migration 001');
```
