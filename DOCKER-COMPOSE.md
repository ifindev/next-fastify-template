# Docker Compose Configuration

This document provides a detailed explanation of our `docker-compose.yml` configuration, which sets up the complete development environment for our application.

## Overview

Our application consists of the following services:

- **client**: Next.js frontend application
- **server**: Backend API service
- **postgres**: PostgreSQL database
- **createbuckets**: Helper service to initialize MinIO buckets

## Services

### Client

```yaml
client:
  build:
    context: ./client
    dockerfile: Dockerfile
  image: next-app
  ports:
    - "3000:3000"
  volumes:
    - ./client:/app
    - /app/node_modules
  environment:
    - NEXT_PUBLIC_API_URL=http://server:3001
  depends_on:
    server:
      condition: service_healthy
```

- **Purpose**: Serves the Next.js frontend application
- **Port**: 3000 (accessible at http://localhost:3000)
- **Volumes**: Mounts the local `./client` directory into the container for live code reloading
- **Dependencies**: Waits for the server to be healthy before starting

### Server

```yaml
server:
  build:
    context: ./server
    dockerfile: Dockerfile
  image: fastify-app
  ports:
    - "3001:3001"
  volumes:
    - ./server:/app
    - /app/node_modules
  environment:
    - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/librarydb?schema=public
    - JWT_SECRET=${JWT_SECRET:-your-secret-key-change-in-production}
    - JWT_EXPIRES_IN=1d
    - S3_ENDPOINT={S3_ENDPOINT}
    - S3_REGION=us-east-1
    - S3_ACCESS_KEY=${S3_ACCESS_KEY}
    - S3_SECRET_KEY=${S3_SECRET_KEY}
    - S3_BUCKET_NAME=uploads
  depends_on:
    postgres:
      condition: service_healthy
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
    interval: 10s
    timeout: 5s
    retries: 3
```

- **Purpose**: Runs the backend API service
- **Port**: 3001 (accessible at http://localhost:3001)
- **Volumes**: Mounts the local `./server` directory for live code reloading
- **Environment Variables**:
  - Database connection details
  - JWT configuration for authentication
  - S3/MinIO configuration for file storage
- **Dependencies**: Waits for both Postgres and MinIO to be healthy before starting
- **Health Check**: Periodically checks the `/health` endpoint to determine service status

### PostgreSQL

```yaml
postgres:
  image: postgres:14-alpine
  environment:
    - POSTGRES_USER=${POSTGRES_USER:-postgres}
    - POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-postgres}
    - POSTGRES_DB=librarydb
  volumes:
    - postgres-data:/var/lib/postgresql/data
  healthcheck:
    test: ["CMD", "pg_isready", "-U", "postgres"]
    interval: 10s
    timeout: 5s
    retries: 3
```

- **Purpose**: Provides the PostgreSQL database
- **Image**: Uses the lightweight Alpine-based PostgreSQL 14
- **Environment Variables**: Configures database credentials with environment variable support
- **Volumes**: Stores data in a named volume for persistence between container restarts
- **Health Check**: Uses `pg_isready` to verify database availability


## Volumes

```yaml
volumes:
  postgres-data:
```

- **postgres-data**: Persistent storage for PostgreSQL data

## Environment Variables

The configuration supports multiple environment variables with sensible defaults:

- `JWT_SECRET`: Secret key for JWT token generation (default: "your-secret-key-change-in-production")
- `JWT_EXPIRES_IN`: JWT token expiration (default: "1d")
- `POSTGRES_USER`: PostgreSQL username (default: "postgres")
- `POSTGRES_PASSWORD`: PostgreSQL password (default: "postgres")
- `S3_ACCESS_KEY`: S3 access key 
- `S3_SECRET_KEY`: S3 secret key 

## Usage

To start all services:

```bash
docker-compose up
```

To rebuild and start all services:

```bash
docker-compose up --build
```

To run in detached mode:

```bash
docker-compose up -d
```

To stop all services:

```bash
docker-compose down
```

To stop and remove volumes:

```bash
docker-compose down -v
``` 