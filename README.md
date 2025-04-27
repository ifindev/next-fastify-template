# Next Fastify Template

A full-stack application template for Next.js Frontend and Fastify Backend with Docker support. 

## Architecture

The project follows a layered architecture with clean separation of concerns:

### Backend (Fastify + TypeScript)

- **Controller Layer**: Handles HTTP requests, validation, and responses
- **Service Layer**: Implements business logic
- **Repository Layer**: Manages data access operations
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: S3-compatible storage (MinIO) for file uploads
- **Authentication**: JWT-based authentication and role-based authorization

### Frontend (Next.js + TypeScript)

- Modern React application with server-side rendering capabilities
- Tailwind CSS for styling
- Responsive mobile-friendly design

## Features

- User authentication and authorization (register, login, profile)
- Role-based access control (admin and regular users)
- File uploads with S3-compatible storage
- Complete CRUD operations for library resources
- Comprehensive API with validation

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)

### Running with Docker

To start the entire application stack:

```bash
docker-compose up --build
```

This will start:
- Frontend (Next.js) on http://localhost:3000
- Backend (Fastify) on http://localhost:3001
- PostgreSQL database
- MinIO (S3-compatible storage) on http://localhost:9000 (API) and http://localhost:9001 (UI)

## Local Development

### Backend

```bash
cd server
npm install
npm run prisma:generate
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

## API Documentation

API documentation is available at: http://localhost:3001/documentation

This project uses Swagger UI for API documentation and interactive testing. Here's how to access and use it:

### Accessing Swagger UI

1. Start the backend server using either Docker or local development setup as described above
2. Open your browser and navigate to http://localhost:3001/documentation
3. The Swagger UI interface will load, displaying all available API endpoints

### Using Swagger UI

1. **Authentication**: For protected endpoints, you'll need to authenticate:
   - Find the login/auth endpoint and execute it to obtain a JWT token
   - Click the "Authorize" button at the top of the page
   - Enter your JWT token in the format `Bearer your-token-here`
   - Click "Authorize" to apply the token to all future requests

2. **Exploring Endpoints**:
   - Endpoints are grouped by tags/categories
   - Click on any endpoint to expand it and see detailed documentation
   - Each endpoint shows required parameters, request body schema, and response examples

3. **Testing Endpoints**:
   - Fill in required parameters and request body for any endpoint
   - Click "Execute" to make a real API call
   - View the response, including status code, headers, and body

4. **Models**:
   - Scroll down to see all data models/schemas used by the API
   - These describe the structure of request and response objects

### Running Swagger in Development Mode

When running the backend in development mode, Swagger UI is automatically enabled. If you need to access it in production, make sure the `ENABLE_SWAGGER` environment variable is set to `true`.

## Testing

The application includes both unit tests and integration tests:

```bash
cd server
npm test
```

## Project Structure

```
.
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/            # Next.js 13+ app router
│   │   ├── components/     # Reusable React components
│   │   ├── lib/            # Utility functions and API clients
│   │   └── hooks/          # Custom React hooks
│   └── ...
├── server/                 # Fastify backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── repositories/   # Data access
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Custom middlewares
│   │   ├── config/         # Configuration
│   │   ├── utils/          # Utility functions
│   │   └── tests/          # Tests
│   ├── prisma/             # Database schema and migrations
│   └── ...
└── docker-compose.yml      # Docker configuration
```
