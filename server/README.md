# Server Documentation

This document provides detailed information about the server architecture, setup, and usage for the Next Fastify Template project.

For docummentation in Indonesia language, go to the [README-ID.md](./README-ID.md) file.

## Table of Contents

- [Architecture](#architecture)
    - [Overview](#overview)
    - [Architecture Diagram](#architecture-diagram)
    - [Layer Explanation](#layer-explanation)
    - [Data Flow](#data-flow)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Standalone PostgreSQL Setup for Development](#standalone-postgresql-setup-for-development)
    - [Configuration](#configuration)
    - [Running the Server](#running-the-server)
    - [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
    - [Swagger UI](#swagger-ui)
    - [Authentication](#authentication)
- [Testing](#testing)
- [Deployment](#deployment)

## Architecture

### Overview

The server is built with Fastify and TypeScript, following a clean layered architecture pattern. This approach separates concerns, improves testability, and makes the codebase more maintainable.

The architecture consists of the following layers:

- Controllers
- Services
- Repositories
- Database (via Drizzle ORM)
- Middlewares
- Configuration
- Utilities

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT REQUEST                         │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                       FASTIFY SERVER                        │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                        MIDDLEWARES                          │
│  ┌─────────────┐  ┌──────────┐  ┌───────────┐  ┌─────────┐  │
│  │ Auth Check  │  │ Logging  │  │ Validation│  │ Others  │  │
│  └─────────────┘  └──────────┘  └───────────┘  └─────────┘  │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                       CONTROLLERS                           │
│  ┌─────────────┐  ┌──────────┐  ┌───────────┐  ┌─────────┐  │
│  │  User       │  │  Auth    │  │  File     │  │  etc.   │  │
│  └──────┬──────┘  └────┬─────┘  └─────┬─────┘  └────┬────┘  │
└─────────┼───────────────┼───────────────┼────────────┼──────┘
          │               │               │            │
          ▼               ▼               ▼            ▼
┌─────────────────────────────────────────────────────────────┐
│                         SERVICES                            │
│  ┌─────────────┐  ┌──────────┐  ┌───────────┐  ┌─────────┐  │
│  │  User       │  │  Auth    │  │  File     │  │  etc.   │  │
│  └──────┬──────┘  └────┬─────┘  └─────┬─────┘  └────┬────┘  │
└─────────┼───────────────┼───────────────┼────────────┼──────┘
          │               │               │            │
          ▼               ▼               ▼            ▼
┌─────────────────────────────────────────────────────────────┐
│                      REPOSITORIES                           │
│  ┌─────────────┐  ┌──────────┐  ┌───────────┐  ┌─────────┐  │
│  │  User       │  │  Auth    │  │  File     │  │  etc.   │  │
│  └──────┬──────┘  └────┬─────┘  └─────┬─────┘  └────┬────┘  │
└─────────┼───────────────┼───────────────┼────────────┼──────┘
          │               │               │            │
          ▼               ▼               ▼            ▼
┌─────────────────────────────────────────────────────────────┐
│                        DRIZZLE ORM                          │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
┌──────────────────────┐    ┌────────────┐    ┌───────────────┐
│  PostgreSQL Database │    │ S3 Storage │    │ External APIs │
└──────────────────────┘    └────────────┘    └───────────────┘
```

This diagram illustrates the flow of a request through our layered architecture, from client request to database operations and back.

### Layer Explanation

**Controllers Layer**

- Responsible for handling HTTP requests and responses
- Validates incoming data
- Routes requests to appropriate services
- Formats responses
- Does not contain business logic

**Services Layer**

- Implements business logic
- Orchestrates data flow between controllers and repositories
- Handles complex operations and transformations
- Independent of HTTP request/response cycle

**Repository Layer**

- Provides data access abstraction
- Interacts with Drizzle ORM to perform database operations
- Isolates database-specific code
- Makes data persistence testable and replaceable

**Schema Layer**

- Defines database schema using Drizzle's schema definition syntax
- Contains type definitions for database entities

**Middleware Layer**

- Handles cross-cutting concerns
- Implements authentication and authorization
- Performs request logging, validation, and error handling
- Manages request lifecycle hooks

**Configuration Layer**

- Centralizes application configuration
- Handles environment variables
- Manages feature flags and application settings

**Utilities Layer**

- Provides helper functions and common utilities
- Implements reusable logic

### Data Flow

1. HTTP request is received by Fastify
2. Request passes through relevant middlewares
3. Controller receives the validated request
4. Controller calls appropriate service method
5. Service processes the business logic
6. Service uses repositories for data access
7. Repository interacts with Drizzle ORM for database operations
8. Results flow back through the service to the controller
9. Controller formats the response and sends it back to the client

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database
- S3-compatible storage (optional, for file uploads)

### Installation

```bash
# Clone the repository if you haven't already
git clone https://github.com/yourusername/next-fastify-template.git
cd next-fastify-template/server

# Install dependencies
npm install
# or
yarn install
```

### Standalone PostgreSQL Setup for Development

When you're actively developing the application, you often want to run the server code directly on your machine (not in Docker) while still having the database available. This approach:

1. **Pull the latest PostgreSQL image**

    ```bash
    docker pull postgres:latest
    ```

    This downloads the official PostgreSQL image from Docker Hub.

2. **Run PostgreSQL container**

    ```bash
    docker run --name local-postgres \
      -e POSTGRES_USER=user \
      -e POSTGRES_PASSWORD=password \
      -e POSTGRES_DB=db \
      -p 5432:5432 \
      -d postgres
    ```

    **Parameters explained:**

    - `--name local-postgres`: Names your container for easy reference
    - `-e POSTGRES_USER=user`: Creates a database user named "user"
    - `-e POSTGRES_PASSWORD=password`: Sets the password
    - `-e POSTGRES_DB=db`: Creates an initial database named "db"
    - `-p 5432:5432`: Maps the container's PostgreSQL port to your host machine
    - `-d`: Runs container in detached mode (background)

3. **Connect your application**

    Update your `.env` file with the connection details:

    ```
    DATABASE_URL=postgresql://user:password@localhost:5432/db
    ```

4. **Initialize the database schema**

    After your database is running, run the Drizzle commands to set up your schema:

    ```bash
    # Generate migrations based on your schema
    npm run drizzle:generate

    # Apply schema changes directly (for development)
    npm run drizzle:push

    # Seed the database with initial data
    npm run drizzle:seed
    ```

5. **Container management commands**

    ```bash
    # Stop the PostgreSQL container
    docker stop local-postgres

    # Start it again later
    docker start local-postgres

    # Remove container
    docker rm local-postgres
    ```

This approach lets you run just the database in Docker while keeping the rest of your development environment native, which can be faster for development iterations.

### Configuration

1. Copy the example environment file:

    ```bash
    cp .env.example .env
    ```

2. Edit the `.env` file with your configuration:

    ```
    # Database
    DATABASE_URL=postgresql://user:password@localhost:5432/mydatabase

    # JWT
    JWT_SECRET=your_jwt_secret_key
    JWT_EXPIRES_IN=1d

    # Server
    PORT=3001
    HOST=0.0.0.0
    NODE_ENV=development

    # S3 Storage (Optional)
    S3_ENDPOINT=http://localhost:9000
    S3_ACCESS_KEY=minioadmin
    S3_SECRET_KEY=minioadmin
    S3_BUCKET=uploads

    # Swagger
    ENABLE_SWAGGER=true
    ```

3. Set up the database:

    ```bash
    # Generate Drizzle migrations based on your schema
    npm run drizzle:generate

    # Push schema changes to the database (development only)
    npm run drizzle:push

    # Or, apply migrations (recommended for production)
    npm run drizzle:migrate

    # Seed the database with initial data
    npm run drizzle:seed
    ```

### Running the Server

**Development Mode**:

```bash
npm run dev
```

**Production Mode**:

```bash
# Build the project
npm run build

# Start the server
npm start
```

**Docker**:

```bash
# From the root directory of the project
docker-compose up --build
```

### Environment Variables

| Variable         | Description                          | Default       |
| ---------------- | ------------------------------------ | ------------- |
| `PORT`           | Server port                          | `3001`        |
| `HOST`           | Server host                          | `0.0.0.0`     |
| `NODE_ENV`       | Environment (development/production) | `development` |
| `DATABASE_URL`   | PostgreSQL connection string         | -             |
| `JWT_SECRET`     | Secret key for JWT tokens            | -             |
| `JWT_EXPIRES_IN` | JWT token expiration                 | `1d`          |
| `ENABLE_SWAGGER` | Enable Swagger documentation         | `true` in dev |
| `S3_ENDPOINT`    | S3 service endpoint                  | -             |
| `S3_ACCESS_KEY`  | S3 access key                        | -             |
| `S3_SECRET_KEY`  | S3 secret key                        | -             |
| `S3_BUCKET`      | S3 bucket name                       | -             |

## API Documentation

### Swagger UI

The API documentation is available through Swagger UI:

1. Start the server (ensure `ENABLE_SWAGGER=true` in your environment)
2. Navigate to `http://localhost:3001/documentation` in your browser
3. The Swagger UI will display all available endpoints, parameters, and response schemas

### Authentication

The API uses JWT for authentication:

1. Register or login through the appropriate endpoints to receive a JWT token
2. Include the token in the `Authorization` header of your requests:
    ```
    Authorization: Bearer your-jwt-token
    ```
3. In Swagger UI:
    - Click the "Authorize" button
    - Enter `Bearer your-jwt-token` in the value field
    - Click "Authorize" to apply the token to all requests

## Testing

The server includes unit and integration tests:

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test -- src/tests/path/to/test.test.ts
```

## Deployment

**Docker Deployment**:
The recommended way to deploy is using Docker:

```bash
# From project root
docker-compose -f docker-compose.prod.yml up -d
```

**Manual Deployment**:

1. Build the project:

    ```bash
    npm run build
    ```

2. Set environment variables for production
3. Start the server:
    ```bash
    npm start
    ```
