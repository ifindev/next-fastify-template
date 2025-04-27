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
- Database (via Prisma ORM)
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
│  │  User       │  │  Auth    │  │  Product  │  │  etc.   │  │
│  └──────┬──────┘  └────┬─────┘  └─────┬─────┘  └────┬────┘  │
└─────────┼───────────────┼───────────────┼────────────┼──────┘
          │               │               │            │
          ▼               ▼               ▼            ▼
┌─────────────────────────────────────────────────────────────┐
│                         SERVICES                            │
│  ┌─────────────┐  ┌──────────┐  ┌───────────┐  ┌─────────┐  │
│  │  User       │  │  Auth    │  │  Product  │  │  etc.   │  │
│  └──────┬──────┘  └────┬─────┘  └─────┬─────┘  └────┬────┘  │
└─────────┼───────────────┼───────────────┼────────────┼──────┘
          │               │               │            │
          ▼               ▼               ▼            ▼
┌─────────────────────────────────────────────────────────────┐
│                      REPOSITORIES                           │
│  ┌─────────────┐  ┌──────────┐  ┌───────────┐  ┌─────────┐  │
│  │  User       │  │  Auth    │  │  Product  │  │  etc.   │  │
│  └──────┬──────┘  └────┬─────┘  └─────┬─────┘  └────┬────┘  │
└─────────┼───────────────┼───────────────┼────────────┼──────┘
          │               │               │            │
          ▼               ▼               ▼            ▼
┌─────────────────────────────────────────────────────────────┐
│                        PRISMA ORM                           │
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
- Interacts with Prisma to perform database operations
- Isolates database-specific code
- Makes data persistence testable and replaceable

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
7. Repository interacts with Prisma for database operations
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
    # Generate Prisma client
    npm run prisma:generate

    # Run migrations
    npm run prisma:migrate

    # (Optional) Seed the database with initial data
    npm run prisma:seed
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
